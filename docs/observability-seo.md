# Observability & SEO

This document covers metadata generation, SEO optimization, and analytics integration.

> **Source of truth:** `src/app/layout.tsx`, `src/app/[lang]/page.tsx`, `src/app/[lang]/[slug]/page.tsx`, `src/components/theme-color-meta/`

## Metadata

### Base Metadata

Root layout (`src/app/layout.tsx`) sets base metadata:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://doganozturk.dev"),
  title: "Doğan Öztürk | Blog",
  description: "I'm Doğan, a software engineer passionate about front-end development...",
  icons: {
    apple: "/favicon/apple-touch-icon.png",
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};
```

### Per-Page Metadata

Each page generates its own metadata via `generateMetadata()`:

**Language Home (`/[lang]/`):**

Uses a `META` object keyed by language:

```typescript
const META = {
  en: { title: "...", description: "...", url: "https://doganozturk.dev/en/" },
  tr: { title: "...", description: "...", url: "https://doganozturk.dev/tr/" },
};
```

Generates:
- Title and description per language
- Canonical URL: `https://doganozturk.dev/{lang}/`
- Alternate languages for `en` and `tr`
- Twitter card with avatar image
- OpenGraph metadata

**Post Pages (`/[lang]/[slug]/`):**

Reads post frontmatter via `getPostBySlug()`:

```typescript
const post = getPostBySlug(slug, lang);
const { title, description, permalink, date } = post.frontmatter;
```

Generates:
- Title and description from frontmatter
- Canonical: `https://doganozturk.dev/{lang}/{slug}/`
- Alternate languages for both `en` and `tr` versions
- OpenGraph with `publishedTime` from frontmatter date
- Twitter summary card

## Canonical & Alternate Links

### Language Alternates

Both language home and post pages include alternate links:

```typescript
alternates: {
  canonical: `https://doganozturk.dev/${lang}/${slug}/`,
  languages: {
    en: `https://doganozturk.dev/en/${slug}/`,
    tr: `https://doganozturk.dev/tr/${slug}/`,
  },
}
```

This helps search engines understand the relationship between language versions.

**Note:** Alternate links are generated for both languages regardless of whether a translated version exists.

## Open Graph & Twitter Cards

Posts include Open Graph metadata for social sharing:

| Property | Source |
|----------|--------|
| `og:title` | Post title |
| `og:description` | Post description |
| `og:type` | `article` |
| `og:url` | Post permalink |
| `og:image` | `/images/avatar.jpg` |
| `article:published_time` | Post date |
| `article:author` | "Doğan Öztürk" |

Twitter cards use `summary` card type with title, description, and avatar image.

## Theme Color

`ThemeColorMeta` component (`src/components/theme-color-meta/`) dynamically sets the browser theme color based on the current theme:

| Theme | Color |
|-------|-------|
| Light | `#faf8f5` |
| Dark | `#0c0a09` |

The component:
1. Renders initial `<meta name="theme-color">` with light theme color
2. Sets `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
3. Uses `useEffect` to update theme-color when `resolvedTheme` changes

This affects the browser chrome color on mobile devices.

## Analytics

### Vercel Analytics

Included in the language layout (`src/app/[lang]/layout.tsx`):

```tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// In layout:
<Analytics />
<SpeedInsights />
```

These provide:
- **Analytics**: Page views, visitors, referrers
- **Speed Insights**: Core Web Vitals, performance metrics

Data is available in the Vercel dashboard.

## Sitemap & Robots

### Sitemap Generation

`next-sitemap` generates sitemaps at build time.

Configuration (`next-sitemap.config.js`):

```javascript
module.exports = {
  siteUrl: "https://doganozturk.dev",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "out",
};
```

### Output Files

Generated in `out/`:
- `sitemap.xml` - All URLs
- `robots.txt` - Crawler directives

### Robots.txt

Default robots.txt allows all crawlers:

```
User-agent: *
Allow: /

Sitemap: https://doganozturk.dev/sitemap.xml
```

## Key Files

| Purpose | Location |
|---------|----------|
| Base metadata | `src/app/layout.tsx` |
| Language home metadata | `src/app/[lang]/page.tsx` |
| Post metadata | `src/app/[lang]/[slug]/page.tsx` |
| Theme color | `src/components/theme-color-meta/` |
| Analytics | `src/app/[lang]/layout.tsx` |
| Sitemap config | `next-sitemap.config.js` |
