import type { ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** Смысловой блок — вертикальный ритм 120–180px (bibliya-lendingov) */
  variant?: "default" | "compact" | "hero";
  background?: "default" | "muted" | "surface";
}

const spacing: Record<NonNullable<SectionProps["variant"]>, string> = {
  hero: "py-16 md:py-24",
  default: "py-28 md:py-36", // ~112–144px mobile, ~144–180px desktop
  compact: "py-16 md:py-20",
};

const backgrounds: Record<NonNullable<SectionProps["background"]>, string> = {
  default: "",
  muted: "bg-surface-container-low",
  surface: "bg-surface-container",
};

export function Section({
  children,
  id,
  className = "",
  containerClassName = "",
  variant = "default",
  background = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${spacing[variant]} ${backgrounds[background]} ${className}`}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
