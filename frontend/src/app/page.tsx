"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { TranscriptInput } from "@/components/TranscriptInput";
import { TranscriptSection } from "@/components/TranscriptSection";
import { AIPanel } from "@/components/AIPanel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTranscript } from "@/lib/api";
import type { TranscriptResponse } from "@/lib/api";
import { FileText, Sparkles, AlertCircle, X, Zap, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const YouTubePlayer = dynamic(
  () => import("@/components/YouTubePlayer").then((m) => ({ default: m.YouTubePlayer })),
  { ssr: false }
);

const SAMPLE_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const FEATURES = [
  { icon: Zap, label: "Instant results", desc: "Get transcripts in seconds" },
  { icon: Lock, label: "No sign-up", desc: "Works right away" },
  { icon: Globe, label: "Any video", desc: "Videos & Shorts supported" },
];

export default function Home() {
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleFetch = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTranscript(url);
      setTranscript(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch transcript");
    } finally {
      setLoading(false);
    }
  }, []);

  if (!transcript) {
    return (
      <main className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/40">
        <header className="flex items-center gap-2.5 px-4 py-4 sm:px-8 sm:py-5">
          <AppLogo size="md" />
          <span className="font-semibold text-foreground tracking-tight">Distill</span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20 sm:pb-32">
          <div className="w-full max-w-2xl space-y-10">
            <div className="text-center space-y-4">
              <div className="hero-stagger-0 inline-flex items-center gap-2 bg-brand-muted text-brand-muted-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-brand-muted-border">
                <span className="size-1.5 rounded-full bg-brand-accent inline-block" />
                Free &amp; instant
              </div>
              <h1 className="hero-stagger-1 text-3xl font-bold tracking-tight text-foreground leading-tight sm:text-5xl">
                Distill any<br />
                <span className="text-brand">YouTube video</span>
              </h1>
              <p className="hero-stagger-2 text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                Paste a YouTube URL and get the transcript, summary, blog post, and more — in seconds.
              </p>
            </div>

            <div className="hero-stagger-3">
              <TranscriptInput
                onSubmit={handleFetch}
                loading={loading}
                error={error}
                onClearError={() => setError(null)}
                variant="hero"
              />
            </div>

            <div className="hero-stagger-4 grid grid-cols-3 gap-3 pt-2">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border text-center">
                  <Icon className="size-4 text-brand" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{desc}</span>
                </div>
              ))}
            </div>

            <p className="hero-stagger-5 text-center text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => handleFetch(SAMPLE_VIDEO_URL)}
                disabled={loading}
                className="text-brand hover:text-brand-accent underline underline-offset-2 transition-colors disabled:opacity-50"
              >
                Try with a sample video
              </button>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-muted/20 overflow-hidden">
      {/* Sticky header */}
      <header className="shrink-0 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <div className="flex items-center gap-2 shrink-0">
            <AppLogo size="sm" />
            <span className="font-semibold text-sm text-foreground">Distill</span>
          </div>
          <div className="flex-1 w-full min-w-0 sm:max-w-xl">
            <TranscriptInput
              onSubmit={handleFetch}
              loading={loading}
              error={error}
              onClearError={() => setError(null)}
              variant="compact"
            />
          </div>
        </div>
      </header>

      {/* Results — fills remaining viewport height */}
      <div className="flex-1 min-h-0 max-w-screen-xl mx-auto w-full p-4 sm:p-5 flex flex-col gap-4 lg:flex-row overflow-hidden">
        {/* Video — fixed width, scrolls with content on mobile */}
        <div className="lg:w-[42%] shrink-0 animate-results-in flex flex-col gap-3">
          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <YouTubePlayer videoId={transcript.video_id} />
          </div>
          {aiError && (
            <Alert variant="destructive" className="animate-error-shake">
              <AlertCircle className="size-4" />
              <AlertTitle>AI Error</AlertTitle>
              <AlertDescription>{aiError}</AlertDescription>
              <AlertAction>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiError(null)}
                  className="h-7 -mr-1"
                >
                  <X className="size-4" />
                </Button>
              </AlertAction>
            </Alert>
          )}
        </div>

        {/* Right panel: Transcript + AI Tools — full height */}
        <div className="flex-1 min-w-0 min-h-0 animate-results-in-delay flex flex-col">
          <Card className="flex-1 min-h-0 overflow-hidden border-border shadow-sm flex flex-col">
            <Tabs defaultValue="transcript" className="flex flex-col h-full min-h-0">
              <div className="border-b border-border px-4 pt-3 shrink-0">
                <TabsList variant="line" className="w-full justify-start h-10 bg-transparent p-0 gap-6">
                  <TabsTrigger
                    value="transcript"
                    className="gap-2 rounded-none border-b-2 border-transparent data-[active]:border-brand data-[active]:text-foreground data-[active]:shadow-none px-1 pb-3 -mb-px text-sm"
                  >
                    <FileText className="size-4" />
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="gap-2 rounded-none border-b-2 border-transparent data-[active]:border-brand data-[active]:text-foreground data-[active]:shadow-none px-1 pb-3 -mb-px text-sm"
                  >
                    <Sparkles className="size-4" />
                    AI Tools
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="transcript" className="flex-1 min-h-0 mt-0 focus-visible:outline-none focus-visible:ring-0">
                <TranscriptSection transcript={transcript} />
              </TabsContent>

              <TabsContent value="ai" className="flex-1 min-h-0 mt-0 focus-visible:outline-none focus-visible:ring-0">
                <AIPanel
                  transcriptText={transcript.paragraphs.join("\n\n")}
                  onError={(msg) => setAiError(msg || null)}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </main>
  );
}
