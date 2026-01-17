# Architecture

This document describes the routing model, MDX pipeline, data layer, and layout architecture.

> **Source of truth:** `next.config.ts`, `src/app/**`, `src/data/posts/**`, `mdx-components.tsx`

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

Both `[lang]` and `[slug]` use `generateStaticParams()` to pre-render all routes at build time.

**Language home page:**

```typescript
// src/app/[lang]/page.tsx
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "tr" }];
}
```

**Post pages:**

```typescript
// src/app/[lang]/[slug]/page.tsx
export function generateStaticParams() {
  return getPostParams();  // Returns [{ lang, slug }, ...]
}

export const dynamicParams = false;
```

The `getPostParams()` function (from `@data/posts/server`) reads all post directories and returns params for both languages.

### Metadata Generation

Each page uses `generateMetadata()` for SEO:

- **Language home**: Uses a `META` object keyed by language with title, description, and canonical URL
- **Post pages**: Reads frontmatter via `getPostBySlug()` and generates OpenGraph/Twitter metadata

### Language Layout

`src/app/[lang]/layout.tsx` sets the `<html lang>` attribute and wraps content with theme/analytics providers.

## MDX Pipeline

### Configuration

MDX is configured in `next.config.ts`:

```typescript
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [
      ["rehype-pretty-code", { theme: "dark-plus", keepBackground: true }],
    ],
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
| `PostVideo` | Lazy-loaded YouTube embeds with thumbnail preview |
| `PostImage` | Optimized images via next-image-export-optimizer |

### Dynamic Import

Post pages dynamically import MDX content:

```typescript
const mdxModule = await import(`@content/posts/${lang}/${slug}/index.mdx`);
Content = mdxModule.default;
```

### Page Extensions

`next.config.ts` includes `.md` and `.mdx` in `pageExtensions` so MDX files can be imported directly.

## Data Layer

### Server-Only Loading

`src/data/posts/server.ts` uses the `server-only` package to ensure functions only run during build/server rendering.

### API

```typescript
getAllPosts(lang?: Lang): PostFrontmatter[]  // All posts, optionally filtered by language
getAllSlugs(lang: Lang): string[]            // All slugs for a language
getPostParams(): PostParams[]                // Static params for all posts
getPostBySlug(slug: string, lang: Lang): PostData | null
getPostByPermalink(permalink: string): PostData | null
```

### Loading Process

1. Read MDX files from `content/posts/[lang]/[slug]/index.mdx`
2. Parse frontmatter with `gray-matter`
3. Validate required fields (title, description, date)
4. Derive permalink from folder structure as `/${lang}/${slug}/`
5. Sort by date (newest first)

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
}

interface PostData {
  frontmatter: PostFrontmatter;
  slug: string;
}

interface PostParams {
  lang: Lang;
  slug: string;
}
```

## Layouts & Providers

### Root Layout (`src/app/layout.tsx`)

- Sets base metadata (title, description, icons, manifest)
- Minimal wrapper that returns `children` directly
- Does **not** render `<html>` or `<body>` (delegated to language layout)

### Language Layout (`src/app/[lang]/layout.tsx`)

- Renders `<html lang={lang}>` for accessibility/SEO
- Imports global CSS (`globals.css`)
- Wraps with `ThemeProvider` (next-themes, attribute="class")
- Includes `ThemeColorMeta` for dynamic browser chrome color
- Adds Vercel Analytics and Speed Insights

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Path |
|-------|------|
| `~/*` or `@/*` | `./src/*` |
| `@content/*` | `./content/*` |
| `@data/*` | `./src/data/*` |
| `@lib/*` | `./src/lib/*` |

**Turbopack configuration** (`next.config.ts`):

Only `~`, `@`, and `@content` are configured in Turbopack's `resolveAlias`. The `@data` and `@lib` aliases are TypeScript-only and resolved by the TS compiler.

## Key Files

| Purpose | Location |
|---------|----------|
| Root redirect | `src/app/page.tsx` |
| Language layout | `src/app/[lang]/layout.tsx` |
| Language home | `src/app/[lang]/page.tsx` |
| Post page | `src/app/[lang]/[slug]/page.tsx` |
| Post data layer | `src/data/posts/server.ts` |
| Post types | `src/data/posts/types.ts` |
| MDX components | `mdx-components.tsx` |
| Next.js config | `next.config.ts` |
