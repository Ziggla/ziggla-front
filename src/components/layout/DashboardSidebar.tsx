"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import UserAvatar from "@/components/ui/UserAvatar";

interface NavItem {
  icon: string;
  labelKey: string;
  href: string;
}

interface DashboardSidebarProps {
  role: "user" | "host" | "admin";
  activeItem: string;
  isOpen: boolean;
}

const userNavItems: NavItem[] = [
  { icon: "dashboard", labelKey: "dashboard", href: "/dashboard/user" },
  { icon: "calendar_month", labelKey: "bookings", href: "/dashboard/user/bookings" },
  { icon: "chat_bubble", labelKey: "messages", href: "/dashboard/user/messages" },
  { icon: "person", labelKey: "profile", href: "/dashboard/user/profile" },
  { icon: "support_agent", labelKey: "support", href: "/contact" },
];

const hostNavItems: NavItem[] = [
  { icon: "dashboard", labelKey: "dashboard", href: "/dashboard/host" },
  { icon: "calendar_month", labelKey: "bookings", href: "/dashboard/host/bookings" },
  { icon: "domain", labelKey: "properties", href: "/dashboard/host/properties" },
  { icon: "chat_bubble", labelKey: "messages", href: "/dashboard/host/messages" },
  { icon: "payments", labelKey: "payouts", href: "/dashboard/host/payouts" },
  { icon: "settings", labelKey: "settings", href: "/dashboard/host/settings" },
];

const adminNavItems: NavItem[] = [
  { icon: "dashboard", labelKey: "dashboard", href: "/dashboard/admin" },
  { icon: "calendar_month", labelKey: "allBookings", href: "/dashboard/admin/bookings" },
  { icon: "domain", labelKey: "properties", href: "/dashboard/admin/properties" },
  { icon: "group", labelKey: "users", href: "/dashboard/admin/users" },
  { icon: "payments", labelKey: "payments", href: "/dashboard/admin/payments" },
  { icon: "analytics", labelKey: "analytics", href: "/dashboard/admin/analytics" },
  { icon: "settings", labelKey: "settings", href: "/dashboard/admin/settings" },
];

export default function DashboardSidebar({ role, activeItem, isOpen }: DashboardSidebarProps) {
  const t = useTranslations("dashboard.sidebar");
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  const displayName = user ? `${user.firstName} ${user.lastName}` : t("userName");
  const initials = user?.initials ?? "??";

  const navItems =
    role === "user"
      ? userNavItems
      : role === "host"
      ? hostNavItems
      : adminNavItems;

  return (
    <aside
      className="h-screen w-64 fixed left-0 top-0 bg-[#101c2e] flex flex-col py-8 z-50"
      style={{
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 300ms ease",
      }}
    >
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link
          href="/"
          className="text-xl font-headline italic text-primary tracking-tight"
        >
          ZIGGLA
        </Link>
        {role === "admin" && (
          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            {t("adminBadge")}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeItem === item.labelKey;
          return (
            <Link
              key={item.labelKey}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 font-medium text-sm tracking-wide ${
                isActive
                  ? "bg-primary/10 text-primary border-r-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-6 space-y-4">
        {role === "host" && (
          <button
            type="button"
            className="w-full py-3 gold-gradient text-on-primary rounded-lg font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-95"
          >
            {t("listProperty")}
          </button>
        )}

        {/* User info + logout — same for all roles */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high">
            <UserAvatar avatarUrl={user?.avatarUrl} initials={initials} size={40} />
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">{displayName}</p>
              <p className="text-[10px] text-primary uppercase tracking-widest font-bold">{role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 text-on-surface-variant/60 px-2 py-2 hover:text-error transition-colors text-xs font-semibold uppercase tracking-widest w-full"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            {t("signOut")}
          </button>
        </div>
      </div>
    </aside>
  );
}
