import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
}

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={`max-w-7xl mx-auto px-5 sm:px-6 md:px-12 lg:px-16 ${className}`}
    >
      {children}
    </Tag>
  );
}
