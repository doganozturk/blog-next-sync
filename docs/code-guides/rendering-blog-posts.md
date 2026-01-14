# Rendering Blog Posts

> How MDX files become rendered pages

## Overview

When someone visits `/en/my-post/`, Next.js needs to turn an MDX file into a fully rendered page with metadata. This involves several steps: extracting route parameters, validating the language, dynamically importing the MDX content, and rendering it with custom components.

The key insight is that MDX files are imported dynamically at runtime (during static generation), not bundled ahead of time. This allows the same page component to render any post.

## The Journey

```
User visits: /en/implementing-dark-mode/
                      │
                      ▼
            ┌─────────────────┐
            │  [slug]/page.tsx │  Extract {lang: "en", slug: "implementing-dark-mode"}
            └────────┬────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
  ┌───────────┐ ┌──────────┐ ┌────────────┐
  │ isLang()  │ │ Metadata │ │ MDX import │
  │ validate  │ │generation│ │ dynamic()  │
  └───────────┘ └──────────┘ └────────────┘
         │           │           │
         └───────────┼───────────┘
                     ▼
            ┌─────────────────┐
            │  Render page    │
            │  PostHeader +   │
            │  <Content /> +  │
            │  Footer         │
            └─────────────────┘
```

## Step 1: Route Parameters

Next.js extracts `lang` and `slug` from the URL path:

```typescript
// From src/app/[lang]/[slug]/page.tsx:8-10
type Props = {
  params: Promise<{ lang: string; slug: string }>;
};
```

The `params` is a Promise (Next.js 15 change) - we await it to get the actual values:

```typescript
// From src/app/[lang]/[slug]/page.tsx:64-65
export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;
```

## Step 2: Language Validation

Before doing anything, we validate that `lang` is a supported language:

```typescript
// From src/data/posts/types.ts:1-6
export const LANGS = ["en", "tr"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return LANGS.includes(value as Lang);
}
```

This is a type guard - it tells TypeScript that if the function returns `true`, the value is definitely a `Lang`. This prevents invalid routes:

```typescript
// From src/app/[lang]/[slug]/page.tsx:67-69
if (!isLang(lang)) {
  notFound();
}
```

## Step 3: Dynamic MDX Import

Here's where the magic happens. Instead of importing all posts at build time, we dynamically import the specific post:

```typescript
// From src/app/[lang]/[slug]/page.tsx:71-78
let Content;
try {
  const mdxModule = await import(`@content/posts/${lang}/${slug}/index.mdx`);
  Content = mdxModule.default;
} catch {
  notFound();
}
```

**What's happening:**
1. `@content` is a path alias pointing to `./content/`
2. The template literal builds the path: `content/posts/en/my-post/index.mdx`
3. `import()` returns a module - MDX files export a React component as `default`
4. If the file doesn't exist, `import()` throws and we show 404

This pattern is powerful because:
- Only the requested post's code is loaded
- The page component stays generic
- Adding new posts requires no code changes

## Step 4: Metadata Generation

For SEO and social sharing, each post needs metadata. This runs at build time:

```typescript
// From src/app/[lang]/[slug]/page.tsx:18-62
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLang(lang)) {
    return {};
  }

  const post = getPostBySlug(slug, lang);

  if (!post) {
    return {};
  }

  const { title, description, permalink, date } = post.frontmatter;

  return {
    title,
    description,
    alternates: {
      canonical: `https://doganozturk.dev/${lang}/${slug}/`,
      languages: {
        en: `https://doganozturk.dev/en/${slug}/`,
        tr: `https://doganozturk.dev/tr/${slug}/`,
      },
    },
    twitter: {
      card: "summary",
      site: "Doğan Öztürk | Blog",
      creator: "Doğan Öztürk",
      title,
      description,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
    },
    openGraph: {
      title,
      type: "article",
      url: `https://doganozturk.dev${permalink}`,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
      description,
      siteName: "doganozturk.dev",
      publishedTime: date,
      authors: ["Doğan Öztürk"],
    },
  };
}
```

Notice how `generateMetadata` uses `getPostBySlug` (not the dynamic import). This is because metadata generation needs the frontmatter data, not the rendered content.

## Step 5: Rendering

Finally, the page renders with the MDX content:

```typescript
// From src/app/[lang]/[slug]/page.tsx:79-90
return (
  <>
    <PostHeader />
    <main>
      <article className="post">
        <Content />
      </article>
    </main>
    <Footer />
  </>
);
```

`<Content />` is the MDX content rendered as a React component. Any custom components (like `<PostImage>`) are available through `mdx-components.tsx`.

## Custom MDX Components

MDX can use custom React components. They're registered in the root `mdx-components.tsx`:

```typescript
// From mdx-components.tsx:1-14
import type { MDXComponents } from "mdx/types";
import { PostVideo } from "~/components/post-video/post-video";
import { PostImage } from "~/components/post-image/post-image";
import { formatDate, Locale } from "@lib/format-date";

export { formatDate, Locale };

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PostVideo,
    PostImage,
    ...components,
  };
}
```

This means in any MDX file, you can write:

```mdx
Here's a video demonstration:

<PostVideo src="/videos/demo.mp4" />

And here's an image:

<PostImage src="/images/screenshot.png" alt="Screenshot" />
```

## Static Generation

To make this work at build time, we tell Next.js which routes to generate:

```typescript
// From src/app/[lang]/[slug]/page.tsx:12-14
export function generateStaticParams() {
  return getPostParams();
}

export const dynamicParams = false;
```

`getPostParams()` returns all valid `{lang, slug}` combinations. `dynamicParams = false` means any route not in this list returns 404 (no runtime generation).

## Key Files

| File | Role |
|------|------|
| `src/app/[lang]/[slug]/page.tsx` | The post page component |
| `src/data/posts/server.ts` | Data layer for reading posts |
| `src/data/posts/types.ts` | Type definitions including `isLang()` |
| `mdx-components.tsx` | Custom MDX component registry |
| `content/posts/[lang]/[slug]/index.mdx` | The actual post content |

## Related Paths

- [Content Data Layer](./content-data-layer.md) - How `getPostBySlug` and `getPostParams` work
- [Internationalization](./internationalization.md) - How the `[lang]` segment is handled
