"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Lightbulb,
  List,
  BookOpen,
  FileEdit,
  Share2 as LinkedinIcon,
  Copy,
  Check,
  Loader2,
  Send,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiTransform } from "@/lib/api";
import { cn } from "@/lib/utils";

const AI_FEATURES = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "key_insights", label: "Key Insights", icon: Lightbulb },
  { id: "bullet_points", label: "Bullet Points", icon: List },
  { id: "flashcards", label: "Flashcards", icon: BookOpen },
  { id: "blog_post", label: "Blog Post", icon: FileEdit },
  { id: "linkedin_article", label: "LinkedIn Article", icon: LinkedinIcon },
] as const;

type FeatureId = (typeof AI_FEATURES)[number]["id"];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIPanelProps {
  transcriptText: string;
  onError?: (msg: string) => void;
}

export function AIPanel({ transcriptText, onError }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [artifact, setArtifact] = useState("");
  const [artifactTitle, setArtifactTitle] = useState("");
  const [lastFeatureType, setLastFeatureType] = useState<FeatureId>("summary");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearError = () => onError?.("");

  const handleRequest = async (
    userContent: string,
    featureType: FeatureId,
    isRefine: boolean
  ) => {
    if (!transcriptText.trim() || loading) return;

    setLoading(true);
    clearError();
    setMessages((m) => [...m, { role: "user", content: userContent }]);

    try {
      const { output } = await aiTransform({
        transcriptText,
        featureType,
        ...(isRefine && artifact
          ? { refinementInstruction: userContent, currentOutput: artifact }
          : {}),
      });

      setArtifact(output);
      const featureLabel = AI_FEATURES.find((f) => f.id === featureType)?.label ?? featureType;
      if (!isRefine) {
        setLastFeatureType(featureType);
        setArtifactTitle(featureLabel);
      }
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: isRefine
            ? "Updated based on your request."
            : `Here's your ${featureLabel}.`,
        },
      ]);
      setInput("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI request failed";
      onError?.(msg);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (featureId: FeatureId) => {
    const feature = AI_FEATURES.find((f) => f.id === featureId);
    handleRequest(feature?.label ?? featureId, featureId, false);
  };

  const inferFeatureFromText = (text: string): FeatureId => {
    const lower = text.toLowerCase();
    if (lower.includes("linkedin")) return "linkedin_article";
    if (lower.includes("summary") || lower.includes("summar")) return "summary";
    if (lower.includes("insight")) return "key_insights";
    if (lower.includes("bullet") || lower.includes("point")) return "bullet_points";
    if (lower.includes("flashcard")) return "flashcards";
    if (lower.includes("blog")) return "blog_post";
    return lastFeatureType;
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const isRefine = !!artifact;
    const featureType = isRefine ? lastFeatureType : inferFeatureFromText(trimmed);
    handleRequest(trimmed, featureType, isRefine);
  };

  const handleCopyArtifact = async () => {
    if (!artifact) return;
    await navigator.clipboard.writeText(artifact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Quick actions — always visible at top */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-muted/20">
        <p className="text-xs font-medium text-muted-foreground mb-2">Quick actions</p>
        <div className="flex flex-wrap gap-1.5">
          {AI_FEATURES.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(id)}
              disabled={loading}
              className="h-7 text-xs gap-1.5 bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="size-3 shrink-0" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main area: chat + artifact side by side */}
      <div className="flex-1 min-h-0 grid md:grid-cols-2">
        {/* Left: Chat history */}
        <div className="flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <div className="size-10 rounded-full bg-brand-muted flex items-center justify-center">
                    <Sparkles className="size-5 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">AI ready</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pick a quick action above or describe what you need
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2.5",
                      msg.role === "user" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 size-6 rounded-full flex items-center justify-center",
                        msg.role === "user"
                          ? "bg-brand text-brand-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User className="size-3" />
                      ) : (
                        <Bot className="size-3 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex-1 min-w-0 rounded-lg px-3 py-2 text-xs leading-relaxed",
                        msg.role === "user"
                          ? "bg-brand/10 text-foreground"
                          : "bg-muted/60 text-muted-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating…
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="shrink-0 p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder={artifact ? "Refine the output…" : "Describe what you need…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
                className="flex-1 h-9 text-sm"
              />
              <Button
                size="sm"
                variant="brand"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="shrink-0 h-9 w-9 p-0"
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Artifact output */}
        <div className="flex flex-col min-h-0">
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">
              {artifactTitle ? artifactTitle : "Output"}
            </span>
            {artifact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyArtifact}
                className="h-7 text-xs gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              {artifact ? (
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">
                  {artifact}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your generated content will appear here
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
