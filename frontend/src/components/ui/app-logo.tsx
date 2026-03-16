"use client";

import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * App logo mark — YouTube-inspired play icon in brand color.
 * Use in headers and branding contexts.
 */
export function AppLogo({ size = "md", className }: AppLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-brand text-brand-foreground",
        size === "sm" && "size-7 rounded-md",
        size === "md" && "size-8",
        className
      )}
    >
      <PlayCircle className={size === "sm" ? "size-4" : "size-5"} />
    </div>
  );
}
