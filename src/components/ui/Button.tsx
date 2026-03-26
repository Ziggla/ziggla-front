import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  asChild?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-label font-semibold tracking-widest uppercase transition-all duration-300 cursor-pointer";

  const variantClasses = {
    primary:
      "gold-gradient text-on-primary hover:opacity-90 active:scale-[0.98]",
    secondary:
      "bg-surface-container-high text-on-surface hover:bg-surface-bright active:scale-[0.98]",
    ghost:
      "bg-transparent text-primary border border-primary/30 hover:bg-primary/10 active:scale-[0.98]",
    dark: "bg-background text-on-background hover:bg-surface-container active:scale-[0.98]",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs rounded-full",
    md: "px-6 py-3 text-xs rounded-full",
    lg: "px-8 py-4 text-sm rounded-full",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
