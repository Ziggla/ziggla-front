import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALES = routing.locales as readonly string[];

function getLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  return LOCALES.includes(seg) ? seg : routing.defaultLocale;
}

function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (LOCALES.includes(seg)) return pathname.slice(seg.length + 1) || "/";
  return pathname;
}

// Routes that require authentication
const AUTH_REQUIRED = ["/dashboard", "/bookings", "/profile", "/booking"];
// Routes only for hosts or admins
const HOST_ONLY = ["/dashboard/host"];
// Routes only for admins
const ADMIN_ONLY = ["/dashboard/admin"];
// Routes that authenticated users should not reach
const GUEST_ONLY = ["/auth/login", "/auth/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(pathname);
  const path = stripLocale(pathname);

  const role = request.cookies.get("ziggla_role")?.value;
  const isAuthed = !!role;

  // Authenticated users → away from login/register
  if (GUEST_ONLY.some((p) => path.startsWith(p)) && isAuthed) {
    const dest = request.nextUrl.clone();
    const dashboard =
      role === "admin"
        ? "/dashboard/admin"
        : role === "host"
          ? "/dashboard/host"
          : "/dashboard/user";
    dest.pathname = `/${locale}${dashboard}`;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  // Unauthenticated → login with redirect param
  if (AUTH_REQUIRED.some((p) => path.startsWith(p)) && !isAuthed) {
    const dest = request.nextUrl.clone();
    dest.pathname = `/${locale}/auth/login`;
    dest.search = `?redirect=${encodeURIComponent(path)}`;
    return NextResponse.redirect(dest);
  }

  // Non-admin → unauthorized for admin dashboard
  if (ADMIN_ONLY.some((p) => path.startsWith(p)) && role !== "admin") {
    const dest = request.nextUrl.clone();
    dest.pathname = `/${locale}/unauthorized`;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  // Non-host/admin → unauthorized for host dashboard
  if (HOST_ONLY.some((p) => path.startsWith(p)) && role !== "host" && role !== "admin") {
    const dest = request.nextUrl.clone();
    dest.pathname = `/${locale}/unauthorized`;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
