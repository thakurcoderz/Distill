"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

/**
 * Stat display with icon — for metrics, counts, and metadata.
 */
export function StatItem({ icon: Icon, children, className }: StatItemProps) {
  return (
    <span className={cn("flex items-center gap-1", className)}>
      <Icon className="size-3.5 shrink-0" />
      {children}
    </span>
  );
}
