"use client";

import { useState } from "react";
import { AlertCircle, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface TranscriptInputProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  onClearError?: () => void;
  variant?: "hero" | "compact";
}

export function TranscriptInput({
  onSubmit,
  loading,
  error,
  onClearError,
  variant = "hero",
}: TranscriptInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || loading) return;
    await onSubmit(trimmed);
  };

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="Paste a YouTube URL…"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error && onClearError) onClearError();
            }}
            disabled={loading}
            className="flex-1 min-h-[44px] h-10 text-sm sm:h-8 sm:min-h-0"
          />
          <Button type="submit" disabled={loading} size="sm" variant="brand" className="shrink-0 min-h-[44px] h-10 sm:h-8 sm:min-h-0 px-3">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Go"}
          </Button>
        </form>
        {error && (
          <p key={error} className="animate-error-shake text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="size-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-background border border-border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand/40 transition-all">
        <div className="relative flex-1 min-w-0">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error && onClearError) onClearError();
            }}
            disabled={loading}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          variant="brand"
          className="h-10 px-5 rounded-xl text-sm font-medium shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin" />
              Loading…
            </span>
          ) : (
            "Get Transcript"
          )}
        </Button>
      </form>

      {error && (
        <Alert key={error} variant="destructive" className="animate-error-shake rounded-xl">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="pt-2">
          <LoadingSkeleton widths={[1, 0.85, 0.7]} staggerMs={120} />
        </div>
      )}
    </div>
  );
}
