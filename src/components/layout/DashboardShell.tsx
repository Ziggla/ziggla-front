"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

interface DashboardShellProps {
  role: "user" | "host" | "admin";
  activeItem: string;
  children: React.ReactNode;
}

export default function DashboardShell({
  role,
  activeItem,
  children,
}: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar role={role} activeItem={activeItem} isOpen={isOpen} />

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle button — always in content area, never inside the sidebar */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        style={{
          position: "fixed",
          zIndex: 9999,
          top: "1rem",
          left: isOpen ? "17rem" : "1rem",
          transition: "left 300ms ease",
        }}
        className="w-9 h-9 bg-surface-container-high border border-outline-variant/20 rounded-lg flex items-center justify-center text-on-surface hover:text-primary hover:border-primary/40 shadow-lg"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <span className="material-symbols-outlined text-base">
          {isOpen ? "dock_to_right" : "menu"}
        </span>
      </button>

      {/* Main content */}
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
