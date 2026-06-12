"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-muted-rose text-white shadow-lg shadow-muted-rose/20 hover:shadow-xl hover:shadow-muted-rose/30",
  secondary: "bg-primary text-white hover:bg-primary/90",
  outline:
    "border-2 border-deep-charcoal text-deep-charcoal hover:bg-deep-charcoal hover:text-white",
  ghost: "text-on-surface-variant hover:text-primary",
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
  disabled,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-title text-sm font-semibold uppercase tracking-wider transition-all min-h-12 min-w-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:active:scale-100";

  const classes = `${base} ${variants[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
