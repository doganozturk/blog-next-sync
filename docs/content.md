# Content Authoring

This document describes how to create and manage blog posts.

> **Source of truth:** `src/data/posts/server.ts`, `mdx-components.tsx`, `content/posts/`

## Post Location

Posts are MDX files located at:

```
content/posts/[lang]/[slug]/index.mdx
```

Where:
- `[lang]` is `en` or `tr`
- `[slug]` is the URL-friendly post identifier (directory name)

### Example

```
content/posts/en/my-new-post/index.mdx
```

This creates a post at `/en/my-new-post/`.

## Required Frontmatter

Every post must include these frontmatter fields:

```yaml
---
title: "Post Title"
description: "A short summary of the post for SEO and previews"
date: "2024-01-15"
permalink: "/en/my-new-post/"
---
```

### Field Details

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title (displayed in header and metadata) |
| `description` | string | Short summary for SEO meta tags and post list |
| `date` | string | Publication date in `YYYY-MM-DD` format |
| `permalink` | string | URL path (will be normalized) |

**Note:** The `lang` field is derived from the folder structure, not from frontmatter.

### Permalink Normalization

The data layer (`src/data/posts/server.ts`) normalizes permalinks:

```typescript
const postSlug = rawPermalink.replace(/^\/?(tr\/)?/, "").replace(/\/$/, "");
const permalink = `/${lang}/${postSlug}/`;
```

- Strips any existing language prefix from the raw permalink
- Reconstructs with the correct language from the folder path
- Ensures leading and trailing slashes

## Post Assets

### Images

Store post images in:

```
public/images/posts/[slug]/
```

Reference in MDX:

```jsx
<PostImage
  src="/images/posts/my-post/screenshot.png"
  alt="Description of image"
/>
```

Images are automatically optimized during build via `next-image-export-optimizer`.

### Videos

Embed YouTube videos using the `PostVideo` component:

```jsx
<PostVideo
  id="VIDEO_ID"
  title="Video title"
/>
```

The component shows a thumbnail initially and lazy-loads the iframe on click for better performance.

## MDX Components

These components are available in all MDX files:

| Component | Props | Description |
|-----------|-------|-------------|
| `PostImage` | `src`, `alt`, `width?`, `height?` | Optimized image with default 800x600 |
| `PostVideo` | `id`, `title` | Lazy-loaded YouTube embed |

Standard Markdown and JSX are also supported.

## Adding a New Post

1. Create the post directory:
   ```bash
   mkdir -p content/posts/en/my-new-post
   ```

2. Create `index.mdx` with frontmatter:
   ```mdx
   ---
   title: "My New Post"
   description: "What this post is about"
   date: "2024-01-15"
   permalink: "/en/my-new-post/"
   ---

   Post content goes here...
   ```

3. Add images (optional):
   ```bash
   mkdir -p public/images/posts/my-new-post
   # Copy images to this directory
   ```

4. Run development server to preview:
   ```bash
   bun dev
   ```

5. Visit `http://localhost:3000/en/my-new-post/`

## Multilingual Posts

To create a Turkish version of an English post:

1. Create the Turkish post directory with the same or translated slug
2. Update `permalink` accordingly
3. Translate the content

Posts in different languages are independent - they don't need matching slugs.

**Note:** Alternate language links in metadata are generated regardless of whether a translation exists.

## Date Formatting

Dates are formatted for display using `src/lib/format-date.ts`:

| Language | Format | Example |
|----------|--------|---------|
| English | `MMMM d, yyyy` | "January 15, 2024" |
| Turkish | `d MMMM yyyy` | "15 Ocak 2024" |

## Post Sorting

Posts are automatically sorted by date (newest first) when retrieved via `getAllPosts()`.
