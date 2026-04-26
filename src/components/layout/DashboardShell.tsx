"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

interface DashboardShellProps {
  role: "user" | "host" | "admin";
  activeItem: string;
  children: React.ReactNode;
}

const STORAGE_KEY = "ziggla_sidebar_open";

export default function DashboardShell({
  role,
  activeItem,
  children,
}: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setIsOpen(stored === "1");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, isOpen ? "1" : "0");
  }, [isOpen, hydrated]);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} activeItem={activeItem} isOpen={isOpen} />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle button — pinned to the sidebar's right edge, vertically centered */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        style={{
          position: "fixed",
          zIndex: 50,
          top: "50%",
          left: isOpen ? "16rem" : "0",
          transform: "translate(-50%, -50%)",
          transition: "left 300ms ease",
        }}
        className="w-8 h-8 bg-surface-container-high border border-outline-variant/30 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/60 shadow-lg"
        aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
      >
        <span className="material-symbols-outlined text-base">
          {isOpen ? "chevron_left" : "chevron_right"}
        </span>
      </button>

      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: isOpen ? "16rem" : "0",
          transition: "margin-left 300ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
