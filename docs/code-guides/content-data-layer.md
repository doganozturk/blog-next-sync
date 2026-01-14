# Content Data Layer

> How posts are organized, parsed, and queried

## Overview

Blog posts live as MDX files on the filesystem. The data layer reads these files, parses their frontmatter with `gray-matter`, and provides functions to query posts by language, slug, or permalink. This layer is server-only - it uses Node.js filesystem APIs that can't run in the browser.

The key design principle: keep content as plain files, query them at build time, and let the static export handle the rest.

## The Data Flow

```
content/posts/en/my-post/index.mdx
              │
              ▼
       ┌─────────────────┐
       │   gray-matter   │  Parse YAML frontmatter
       │  { data, content }
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ parseFrontmatter │  Validate & normalize
       │   PostFrontmatter
       └────────┬────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────────┐
│getAllPosts│getPostBySlug│getPostParams│
│  list    │ │  single   │ │  routing    │
└─────────┘ └─────────┘ └─────────────┘
```

## File Organization

Posts follow a strict directory convention:

```
content/posts/
├── en/
│   ├── my-first-post/
│   │   └── index.mdx
│   ├── implementing-dark-mode/
│   │   └── index.mdx
│   └── typescript-tips/
│       └── index.mdx
└── tr/
    ├── ilk-yazim/
    │   └── index.mdx
    └── typescript-ipuclari/
        └── index.mdx
```

Each post:
- Lives in a language folder (`en/` or `tr/`)
- Has its own directory (the slug)
- Contains `index.mdx` as the content file

This structure allows posts to include assets (images, files) in their directory.

## Frontmatter Structure

Every MDX file starts with YAML frontmatter:

```yaml
---
title: "Implementing Dark Mode"
description: "A guide to adding dark mode to your React app"
date: "2024-01-15"
permalink: "/implementing-dark-mode/"
lang: "en"
---

Your markdown content here...
```

The TypeScript types reflect this:

```typescript
// From src/data/posts/types.ts:8-14
export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  permalink: string;
  lang: Lang;
}
```

## Server-Only Module

The data layer is marked as server-only:

```typescript
// From src/data/posts/server.ts:1
import "server-only";
```

This import causes a build error if you accidentally import this module in client code. It's a safety mechanism - filesystem access won't work in browsers.

## Parsing Frontmatter

The `parseFrontmatter` function validates and normalizes raw frontmatter:

```typescript
// From src/data/posts/server.ts:14-47
function parseFrontmatter(
  data: Record<string, unknown>,
  lang: Lang,
  slug: string
): PostFrontmatter {
  const title = data.title;
  const description = data.description;
  const date = data.date;
  const rawPermalink = data.permalink;

  if (typeof title !== "string" || !title) {
    throw new Error(`Missing or invalid title in ${lang}/${slug}`);
  }
  if (typeof description !== "string" || !description) {
    throw new Error(`Missing or invalid description in ${lang}/${slug}`);
  }
  if (typeof date !== "string" || !date) {
    throw new Error(`Missing or invalid date in ${lang}/${slug}`);
  }
  if (typeof rawPermalink !== "string" || !rawPermalink) {
    throw new Error(`Missing or invalid permalink in ${lang}/${slug}`);
  }

  const postSlug = rawPermalink.replace(/^\/?(tr\/)?/, "").replace(/\/$/, "");
  const permalink = `/${lang}/${postSlug}/`;

  return {
    title,
    description,
    date,
    permalink,
    lang,
  };
}
```

**Key behaviors:**
- Throws descriptive errors for missing fields (helps catch mistakes)
- Normalizes permalinks to consistent format (`/en/slug/`)
- Strips any existing language prefix from permalink

## Getting All Posts

`getAllPosts` scans the filesystem and returns sorted posts:

```typescript
// From src/data/posts/server.ts:49-81
export function getAllPosts(lang?: Lang): PostFrontmatter[] {
  const languages: readonly Lang[] = lang ? [lang] : ["en", "tr"];
  const posts: PostFrontmatter[] = [];

  for (const language of languages) {
    const postsDir = getPostsDirectory(language);

    if (!fs.existsSync(postsDir)) {
      continue;
    }

    const slugs = fs.readdirSync(postsDir);

    for (const slug of slugs) {
      const postPath = path.join(postsDir, slug, "index.mdx");

      if (!fs.existsSync(postPath)) {
        continue;
      }

      const fileContents = fs.readFileSync(postPath, "utf8");
      const { data } = matter(fileContents);

      posts.push(parseFrontmatter(data, language, slug));
    }
  }

  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}
```

**Usage patterns:**
```typescript
// All posts (both languages), newest first
getAllPosts()

// Only English posts
getAllPosts("en")

// Only Turkish posts
getAllPosts("tr")
```

## Getting a Single Post

`getPostBySlug` returns full post data including content:

```typescript
// From src/data/posts/server.ts:102-118
export function getPostBySlug(slug: string, lang: Lang): PostData | null {
  const postsDir = getPostsDirectory(lang);
  const postPath = path.join(postsDir, slug, "index.mdx");

  if (!fs.existsSync(postPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: parseFrontmatter(data, lang, slug),
    slug,
    content,
  };
}
```

The return type includes the raw MDX content:

```typescript
// From src/data/posts/types.ts:16-20
export interface PostData {
  frontmatter: PostFrontmatter;
  slug: string;
  content: string;
}
```

Note: The `content` field contains raw MDX text. For rendered content, use the dynamic import pattern in the page component.

## Route Parameters Generation

`getPostParams` provides data for Next.js static generation:

```typescript
// From src/data/posts/server.ts:96-100
export function getPostParams(): PostParams[] {
  const enSlugs = getAllSlugs("en").map((slug) => ({ lang: "en" as const, slug }));
  const trSlugs = getAllSlugs("tr").map((slug) => ({ lang: "tr" as const, slug }));
  return [...enSlugs, ...trSlugs];
}
```

This is used in `generateStaticParams()`:

```typescript
// From src/app/[lang]/[slug]/page.tsx:12-14
export function generateStaticParams() {
  return getPostParams();
}
```

Next.js calls this at build time to know which routes to generate.

## Language Type Safety

The `Lang` type and `isLang` guard ensure type safety:

```typescript
// From src/data/posts/types.ts:1-6
export const LANGS = ["en", "tr"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return LANGS.includes(value as Lang);
}
```

**Why this pattern?**
1. `LANGS` is a const array - TypeScript knows the exact values
2. `Lang` is derived from the array - always in sync
3. `isLang()` is a type guard - narrows `string` to `Lang`

Usage:

```typescript
const lang: string = params.lang;  // Could be anything

if (!isLang(lang)) {
  notFound();  // Not a valid language
}

// After the guard, TypeScript knows lang is "en" | "tr"
getAllPosts(lang);  // ✓ Type safe
```

## Helper Functions

Two utility functions support the main queries:

```typescript
// From src/data/posts/server.ts:8-12
const CONTENT_DIR = path.join(process.cwd(), "content/posts");

function getPostsDirectory(lang: Lang): string {
  return path.join(CONTENT_DIR, lang);
}
```

```typescript
// From src/data/posts/server.ts:83-94
export function getAllSlugs(lang: Lang): string[] {
  const postsDir = getPostsDirectory(lang);

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  return fs.readdirSync(postsDir).filter((slug) => {
    const postPath = path.join(postsDir, slug, "index.mdx");
    return fs.existsSync(postPath);
  });
}
```

## gray-matter

The `gray-matter` library handles frontmatter parsing:

```typescript
import matter from "gray-matter";

const fileContents = fs.readFileSync(postPath, "utf8");
const { data, content } = matter(fileContents);
// data = parsed YAML as object
// content = everything after the frontmatter
```

It handles the `---` delimiters and YAML parsing automatically.

## Key Files

| File | Purpose |
|------|---------|
| `src/data/posts/server.ts` | All data access functions |
| `src/data/posts/types.ts` | TypeScript types and `isLang()` guard |
| `content/posts/` | The actual MDX content |

## Related Paths

- [Rendering Blog Posts](./rendering-blog-posts.md) - How the data layer is used in pages
- [Internationalization](./internationalization.md) - How language routing works
