"use client";

import { useState } from "react";
import { Copy, Check, BookOpen, Clock, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatItem } from "@/components/ui/stat-item";
import type { TranscriptResponse } from "@/lib/api";

interface TranscriptDisplayProps {
  transcript: TranscriptResponse;
  /** When true, only render the paragraph content (no header). Used inside collapsible. */
  contentOnly?: boolean;
}

export function TranscriptDisplay({ transcript, contentOnly }: TranscriptDisplayProps) {
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

  if (contentOnly) {
    return (
      <div className="max-h-[62vh] min-h-[200px] overflow-y-auto px-4 py-4 space-y-4 sm:px-5 [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.200)_transparent]">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-sm text-slate-700 leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-3 pt-4 px-4 sm:px-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Transcript</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            title="Copy transcript to clipboard"
            className="gap-1.5 min-h-[44px] h-10 px-3 text-xs sm:h-8 sm:min-h-0 touch-manipulation"
          >
            {copied ? (
              <span key="copied" className="animate-copy-success inline-flex items-center gap-1.5 text-green-600">
                <Check className="size-3.5" />
                Copied!
              </span>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy all
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <StatItem icon={AlignLeft}>
            {paragraphs.length} paragraph{paragraphs.length !== 1 ? "s" : ""}
          </StatItem>
          <StatItem icon={BookOpen}>{wordCount.toLocaleString()} words</StatItem>
          <StatItem icon={Clock}>~{readingMins} min read</StatItem>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 relative">
        <div className="max-h-[62vh] min-h-[200px] overflow-y-auto px-4 py-4 space-y-4 sm:px-5 [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.200)_transparent]">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-slate-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        {/* Gradient fade at bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </CardContent>
    </Card>
  );
}
