"use client";

import { useState } from "react";
import { Copy, Check, AlignLeft, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TranscriptResponse } from "@/lib/api";

interface TranscriptSectionProps {
  transcript: TranscriptResponse;
}

export function TranscriptSection({ transcript }: TranscriptSectionProps) {
  const [copied, setCopied] = useState(false);

  const paragraphs = transcript.paragraphs ?? [];
  const plainText = paragraphs.join("\n\n");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingMins = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Stats bar */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <AlignLeft className="size-3.5" />
            {paragraphs.length} paragraph{paragraphs.length !== 1 ? "s" : ""}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            {wordCount.toLocaleString()} words
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            ~{readingMins} min read
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          title="Copy transcript"
          className="h-7 gap-1.5 text-xs shrink-0"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Scrollable transcript */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-5 space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-foreground/80 leading-7">
              {para}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
