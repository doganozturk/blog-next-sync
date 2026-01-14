# Internationalization

> How i18n routing works with Next.js App Router

## Overview

The blog supports English and Turkish content through URL-based routing. Every page URL starts with a language segment (`/en/` or `/tr/`), which determines both the content language and the HTML `lang` attribute. This is implemented using Next.js dynamic route segments.

The approach is simple: content is organized by language in the filesystem, and the URL structure mirrors this organization.

## The Routing Structure

```
URL Pattern                 Handler
─────────────────────────   ───────────────────────────
/                           src/app/page.tsx (redirects)
/en/                        src/app/[lang]/page.tsx
/tr/                        src/app/[lang]/page.tsx
/en/my-post/                src/app/[lang]/[slug]/page.tsx
/tr/yazi-basligi/           src/app/[lang]/[slug]/page.tsx
```

## Root Redirect

The root path redirects to `/en/`:

```typescript
// From src/app/page.tsx (simplified)
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en/");
}
```

This ensures users always land on a language-specific page.

## Language Layout

The `[lang]` folder contains a layout that handles language-specific setup:

```typescript
// From src/app/[lang]/layout.tsx:1-40
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeColorMeta } from "~/components/theme-color-meta/theme-color-meta";
import "~/app/globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "tr" }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeColorMeta />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="theme-container">
            <div className="container">{children}</div>
          </div>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

**Key behaviors:**
- Sets `<html lang={lang}>` for accessibility and SEO
- `generateStaticParams()` tells Next.js which languages exist
- All children share this layout (theme, analytics, styles)

## Homepage by Language

The homepage shows posts filtered by language:

```typescript
// From src/app/[lang]/page.tsx:70-88
export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  if (!isLang(lang)) {
    notFound();
  }

  const posts = getAllPosts(lang);

  return (
    <>
      <MainHeader />
      <main className="main">
        <PostSummaryList data={posts} />
      </main>
      <Footer />
    </>
  );
}
```

`getAllPosts(lang)` returns only posts in the requested language.

## Language-Specific Metadata

Each language has its own metadata:

```typescript
// From src/app/[lang]/page.tsx:13-26
const META = {
  en: {
    title: "Doğan Öztürk | Blog",
    description:
      "I'm Doğan, a software engineer passionate about front-end development...",
    url: "https://doganozturk.dev/en/",
  },
  tr: {
    title: "Doğan Öztürk | Blog",
    description:
      "Ben Doğan, front-end geliştirme, JavaScript ve Node.js tutkusu olan...",
    url: "https://doganozturk.dev/tr/",
  },
} as const;
```

The `generateMetadata` function uses this:

```typescript
// From src/app/[lang]/page.tsx:32-68
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  if (!isLang(lang)) {
    return {};
  }

  const { title, description, url } = META[lang];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: "https://doganozturk.dev/en/",
        tr: "https://doganozturk.dev/tr/",
      },
    },
    // ... twitter, openGraph
  };
}
```

The `alternates.languages` tells search engines about the language variants.

## Post Pages

Individual posts also use the language parameter:

```typescript
// From src/app/[lang]/[slug]/page.tsx:64-78
export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!isLang(lang)) {
    notFound();
  }

  let Content;
  try {
    const mdxModule = await import(`@content/posts/${lang}/${slug}/index.mdx`);
    Content = mdxModule.default;
  } catch {
    notFound();
  }
  // ...
}
```

The dynamic import path includes the language: `@content/posts/en/my-post/index.mdx`.

## Language Validation

The `isLang` type guard validates language parameters:

```typescript
// From src/data/posts/types.ts:1-6
export const LANGS = ["en", "tr"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return LANGS.includes(value as Lang);
}
```

This is used everywhere a language parameter is received:

```typescript
if (!isLang(lang)) {
  notFound();
}
```

Without this, someone could request `/xyz/my-post/` and cause errors.

## Static Generation

Both the layout and pages declare their static params:

```typescript
// Layout: only two languages exist
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "tr" }];
}

// Posts: all valid {lang, slug} combinations
export function generateStaticParams() {
  return getPostParams();
}
```

At build time, Next.js generates:
- `/en/` and `/tr/` homepages
- `/en/post-1/`, `/en/post-2/`, `/tr/yazi-1/`, etc.

## Language Alternates

For SEO, each page declares its language alternatives:

```typescript
// From src/app/[lang]/[slug]/page.tsx:36-40
alternates: {
  canonical: `https://doganozturk.dev/${lang}/${slug}/`,
  languages: {
    en: `https://doganozturk.dev/en/${slug}/`,
    tr: `https://doganozturk.dev/tr/${slug}/`,
  },
},
```

This tells search engines "this page exists in both English and Turkish at these URLs". Note that this assumes the same slug exists in both languages - for posts that don't have translations, this would need adjustment.

## Legacy Redirects

Old URLs without language prefix are redirected in `vercel.json`:

```json
{
  "redirects": [
    { "source": "/old-post-slug", "destination": "/en/old-post-slug/", "permanent": true }
  ]
}
```

This maintains backward compatibility with URLs from before i18n was added.

## The Complete Flow

```
Request: /tr/typescript-ipuclari/

1. [lang]/layout.tsx receives { lang: "tr" }
   → Sets <html lang="tr">
   → Wraps children in ThemeProvider

2. [lang]/[slug]/page.tsx receives { lang: "tr", slug: "typescript-ipuclari" }
   → isLang("tr") returns true
   → import("@content/posts/tr/typescript-ipuclari/index.mdx")
   → Renders the Turkish post

3. generateMetadata runs
   → Uses Turkish post frontmatter
   → Sets alternates for both languages
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/[lang]/layout.tsx` | Language-aware layout with `<html lang>` |
| `src/app/[lang]/page.tsx` | Language-filtered homepage |
| `src/app/[lang]/[slug]/page.tsx` | Individual post page |
| `src/data/posts/types.ts` | `Lang` type and `isLang()` guard |
| `vercel.json` | Legacy URL redirects |

## Related Paths

- [Rendering Blog Posts](./rendering-blog-posts.md) - How posts use the language parameter
- [Content Data Layer](./content-data-layer.md) - How content is organized by language
