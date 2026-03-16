"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  /** Number of bars (default 3) */
  bars?: number;
  /** Bar widths as fractions 0–1, e.g. [1, 0.85, 0.7] */
  widths?: number[];
  /** Stagger delay between bars in ms (default 120) */
  staggerMs?: number;
  className?: string;
}

/**
 * Staggered pulse skeleton for loading states.
 * Uses transform + opacity for GPU-accelerated animation.
 */
export function LoadingSkeleton({
  bars = 3,
  widths = [1, 0.85, 0.7],
  staggerMs = 120,
  className,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-slate-200 animate-pulse"
          style={{
            width: `${(widths[i] ?? widths[widths.length - 1]) * 100}%`,
            animationDelay: `${i * staggerMs}ms`,
          }}
        />
      ))}
    </div>
  );
}
