# Blog Code Guide

> Understanding how the Next.js blog works under the hood

## What This App Does

This is a personal blog built with Next.js App Router, featuring MDX content with syntax highlighting, dark/light theming, and internationalization (English and Turkish). Posts are organized as MDX files in a language-based folder structure and rendered as static pages at build time.

The blog is designed for performance: it's exported as a fully static site, uses optimized images, and supports both system and user-selected theme preferences.

## Code Paths

| Guide | What You'll Learn |
|-------|-------------------|
| [Rendering Blog Posts](./rendering-blog-posts.md) | How MDX files become rendered pages |
| [Content Data Layer](./content-data-layer.md) | How posts are organized, parsed, and queried |
| [Internationalization](./internationalization.md) | How i18n routing works with Next.js App Router |
| [Theming System](./theming-system.md) | How dark/light mode works with persistence |

## Where to Start

**Adding a new post?** Check [Content Data Layer](./content-data-layer.md) for the file structure and frontmatter format.

**Working on styling?** Start with [Theming System](./theming-system.md) for CSS variables and theme switching.

**Understanding routing?** [Internationalization](./internationalization.md) explains the `[lang]/[slug]` pattern.

## Architecture Overview

```
User visits: /en/my-post/
              │
              ▼
    ┌─────────────────┐
    │ [lang]/layout   │  Sets <html lang="en">
    │   ThemeProvider │  Wraps children with theme context
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  [slug]/page    │  Route handler
    │generateMetadata │  SEO + Open Graph
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌────────────┐  ┌────────────────┐
│ server.ts  │  │ Dynamic MDX    │
│getPostBySlug│  │ import()       │
└────────────┘  └────────────────┘
       │                 │
       ▼                 ▼
┌────────────┐  ┌────────────────┐
│ gray-matter│  │ mdx-components │
│ frontmatter│  │ PostImage, etc │
└────────────┘  └────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  Rendered Post  │
    │  with metadata  │
    └─────────────────┘
```

## Key Concepts

- **MDX**: Markdown with JSX support - allows using React components inside blog posts (like `<PostImage>` or `<PostVideo>`)

- **Frontmatter**: YAML metadata at the top of each MDX file (`title`, `description`, `date`, `permalink`, `lang`)

- **Static Generation**: All pages are pre-rendered at build time using `generateStaticParams()`. No server runtime needed.

- **Language Segments**: URLs start with `/en/` or `/tr/` - this is a Next.js dynamic segment that determines which content to load

- **Theme Persistence**: Uses `next-themes` library which stores preference in localStorage and respects system preference

## Content Structure

```
content/posts/
├── en/
│   ├── my-first-post/
│   │   └── index.mdx
│   └── another-post/
│       └── index.mdx
└── tr/
    ├── ilk-yazilarim/
    │   └── index.mdx
    └── diger-yazi/
        └── index.mdx
```

Each post has its frontmatter:

```yaml
---
title: "My Post Title"
description: "A brief description for SEO"
date: "2024-01-15"
permalink: "/my-post-slug/"
lang: "en"
---
```

## Source Files

| File | Purpose |
|------|---------|
| `src/app/[lang]/layout.tsx` | Language layout with theme provider |
| `src/app/[lang]/page.tsx` | Homepage listing all posts |
| `src/app/[lang]/[slug]/page.tsx` | Individual post page |
| `src/data/posts/server.ts` | Data layer - reads and parses MDX files |
| `src/data/posts/types.ts` | TypeScript types for posts |
| `mdx-components.tsx` | Custom MDX component registry |
| `src/components/theme-switcher/` | Theme toggle component |
| `src/components/theme-color-meta/` | Dynamic meta theme-color tag |

## Related Resources

- [CLAUDE.md](../../../apps/blog/CLAUDE.md) - Quick reference for working with this package
- [Next.js App Router](https://nextjs.org/docs/app) - Framework documentation
- [MDX](https://mdxjs.com/) - Markdown + JSX
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme library used
