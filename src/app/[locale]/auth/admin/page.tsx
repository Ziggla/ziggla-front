"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@ziggla.com");
  const [password, setPassword] = useState("ziggla123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "admin") {
        setError("Access denied — admin credentials required.");
        return;
      }
      router.push("/dashboard/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 bg-background relative overflow-hidden">
      {/* Dark grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(230,195,100,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(230,195,100,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative w-full max-w-md">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/auth/login" className="flex items-center gap-2 text-xs text-on-surface-variant/60 hover:text-on-surface-variant transition-colors uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to login
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-error/10 border border-error/20">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-error">Admin Access</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-container-low p-10 rounded-xl" style={{ boxShadow: "0 0 0 1px rgba(230,195,100,0.08), 0 40px 80px rgba(0,0,0,0.4)" }}>
          {/* Logo + badge */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4" style={{ border: "1px solid rgba(230,195,100,0.2)" }}>
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                admin_panel_settings
              </span>
            </div>
            <h1 className="text-3xl font-headline text-on-surface mb-1">Admin Portal</h1>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest">
              Ziggla Operations Center
            </p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 px-4 py-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-on-surface-variant">
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                Admin Email
              </label>
              <input
                className="w-full bg-surface-container-high text-on-surface py-4 px-5 rounded-lg focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant outline-none border-none"
                placeholder="admin@ziggla.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-label text-on-surface-variant uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-high text-on-surface py-4 px-5 pr-12 rounded-lg focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant outline-none border-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-error font-medium px-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg font-label font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #e6c364, #c9a84c)", color: "#071325" }}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_open
              </span>
              {isLoading ? "Authenticating…" : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-6 flex items-center gap-3 text-[10px] text-on-surface-variant/40 uppercase tracking-widest" style={{ borderTop: "1px solid rgba(77,70,55,0.15)" }}>
            <span className="material-symbols-outlined text-sm">security</span>
            All access is logged and monitored
          </div>
        </div>
      </div>
    </main>
  );
}
