# Architecture

This document describes the routing model, MDX pipeline, data layer, and layout architecture.

## Overview

This is a Next.js 16 blog with:
- **App Router** with dynamic `[lang]` segment for i18n (English + Turkish)
- **Static export** (`output: "export"`) for Vercel deployment
- **MDX** for blog post content with custom components

## Routing & i18n

| URL Pattern | File | Purpose |
|-------------|------|---------|
| `/` | `src/app/page.tsx` | Redirects to `/en/` |
| `/[lang]/` | `src/app/[lang]/page.tsx` | Language home (post list) |
| `/[lang]/[slug]/` | `src/app/[lang]/[slug]/page.tsx` | Individual post |

### Static Generation

Both `[lang]` and `[slug]` use `generateStaticParams()` to pre-render all routes at build time:

```typescript
// src/app/[lang]/page.tsx
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

// src/app/[lang]/[slug]/page.tsx
export async function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    getAllPosts(lang).map((post) => ({
      lang,
      slug: post.slug,
    }))
  );
}
```

Dynamic params are disabled (`dynamicParams = false`) so only pre-rendered routes are valid.

### Language Layout

`src/app/[lang]/layout.tsx` sets the `<html lang>` attribute and wraps content with theme/analytics providers.

## MDX Pipeline

### Configuration

MDX is configured in `next.config.ts`:

```typescript
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [[rehypePrettyCode, { theme: "dark-plus" }]],
  },
});
```

Key plugins:
- **remark-frontmatter** + **remark-mdx-frontmatter**: Parse YAML frontmatter and expose as `meta` export
- **rehype-pretty-code**: Syntax highlighting with VS Code's `dark-plus` theme

### Custom Components

`mdx-components.tsx` registers custom MDX components:

| Component | Purpose |
|-----------|---------|
| `PostVideo` | Responsive video embeds |
| `PostImage` | Optimized images with captions |

### Page Extensions

`next.config.ts` includes `.md` and `.mdx` in `pageExtensions` so MDX files can be imported directly.

## Data Layer

### Server-Only Loading

`src/data/posts/server.ts` provides functions to load posts:

```typescript
getAllPosts(lang: Lang): PostFrontmatter[]  // All posts for a language
getPostBySlug(slug: string, lang: Lang): PostFrontmatter | undefined
```

These functions:
1. Read MDX files from `content/posts/[lang]/[slug]/index.mdx`
2. Parse frontmatter with `gray-matter`
3. Validate required fields (title, description, date, permalink, lang)
4. Normalize permalinks to `/{lang}/{slug}/` format

### Types

`src/data/posts/types.ts` defines:

```typescript
type Lang = "en" | "tr";

interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  permalink: string;
  lang: Lang;
  slug: string;
}
```

## Layouts & Providers

### Root Layout (`src/app/layout.tsx`)

- Sets base metadata (title, description, icons)
- Minimal wrapper, delegates to language layout

### Language Layout (`src/app/[lang]/layout.tsx`)

- Sets `<html lang={lang}>` for accessibility/SEO
- Wraps with `ThemeProvider` (next-themes)
- Includes `ThemeColorMeta` for dynamic theme color
- Adds Vercel Analytics and Speed Insights

## Path Aliases

Configured in `tsconfig.json`:

```
~ or @     → ./src/*
@content   → ./content/*
@data      → ./src/data/*
@lib       → ./src/lib/*
```

Note: `~`, `@`, and `@content` are also configured in Turbopack's `resolveAlias` for bundler compatibility.

## Key Files

| Purpose | Location |
|---------|----------|
| Root redirect | `src/app/page.tsx` |
| Language layout | `src/app/[lang]/layout.tsx` |
| Post page | `src/app/[lang]/[slug]/page.tsx` |
| Post data layer | `src/data/posts/server.ts` |
| MDX components | `mdx-components.tsx` |
| Next.js config | `next.config.ts` |
| ESLint config | `eslint.config.mjs` |
