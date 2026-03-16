# Design System

Shared components and tokens for the Transcribe app. Built on [shadcn/ui](https://ui.shadcn.com) with Tailwind v4.

## Brand Tokens

Semantic colors for app branding (YouTube-inspired red):

| Token | Use |
|-------|-----|
| `brand` | Primary accent, CTAs, logo background |
| `brand-foreground` | Text on brand backgrounds |
| `brand-muted` | Badge backgrounds, subtle emphasis |
| `brand-muted-foreground` | Text on muted brand |
| `brand-muted-border` | Borders for muted surfaces |
| `brand-accent` | Dots, focus rings, highlights |

**Usage:** `bg-brand`, `text-brand`, `border-brand-muted-border`, etc.

## Components

### `AppLogo`
Logo mark (play icon in brand color). Use in headers.

```tsx
<AppLogo size="md" />  // Hero
<AppLogo size="sm" />  // Compact header
```

### `Button` variant: `brand`
Primary CTA style with hover/active micro-interactions.

```tsx
<Button variant="brand">Get Transcript</Button>
```

### `StatItem`
Icon + label for metrics and metadata.

```tsx
<StatItem icon={BookOpen}>{wordCount} words</StatItem>
```

### `LoadingSkeleton`
Staggered pulse bars for loading states.

```tsx
<LoadingSkeleton widths={[1, 0.85, 0.7]} staggerMs={120} />
```

## Motion Tokens

Defined in `globals.css`:

- `--ease-out-quart`, `--ease-out-expo` — easing curves
- `--duration-instant` (120ms), `--duration-fast` (200ms), `--duration-normal` (300ms), `--duration-slow` (500ms)

Utility classes: `animate-error-shake`, `animate-copy-success`, `animate-results-in`, `hero-stagger-*`
