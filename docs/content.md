# Content Authoring

This document describes how to create and manage blog posts.

## Post Location

Posts are MDX files located at:

```
content/posts/[lang]/[slug]/index.mdx
```

Where:
- `[lang]` is `en` or `tr`
- `[slug]` is the URL-friendly post identifier

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
lang: "en"
---
```

### Field Details

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Post title (displayed in header and metadata) |
| `description` | string | Short summary for SEO meta tags and post list |
| `date` | string | Publication date in `YYYY-MM-DD` format |
| `permalink` | string | Full URL path including language prefix |
| `lang` | `"en"` \| `"tr"` | Post language |

### Permalink Normalization

The data layer (`src/data/posts/server.ts`) normalizes permalinks:
- Ensures leading slash
- Ensures trailing slash
- Format: `/{lang}/{slug}/`

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

Embed videos using the `PostVideo` component:

```jsx
<PostVideo
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video title"
/>
```

## MDX Components

These components are available in all MDX files:

| Component | Usage |
|-----------|-------|
| `PostImage` | `<PostImage src="..." alt="..." />` |
| `PostVideo` | `<PostVideo src="..." title="..." />` |

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
   lang: "en"
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
2. Set `lang: "tr"` and update `permalink` accordingly
3. Translate the content

Posts in different languages are independent - they don't need matching slugs.

## Date Formatting

Dates are formatted for display using `src/lib/format-date.ts`:
- English: "January 15, 2024"
- Turkish: "15 Ocak 2024"
