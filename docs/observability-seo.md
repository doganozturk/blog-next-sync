# Observability & SEO

This document covers metadata generation, SEO optimization, and analytics integration.

## Metadata

### Base Metadata

Root layout (`src/app/layout.tsx`) sets base metadata:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://doganozturk.dev"),
  title: {
    default: "Doğan Öztürk",
    template: "%s | Doğan Öztürk",
  },
  description: "Personal blog...",
  icons: { ... },
};
```

### Per-Page Metadata

Each page generates its own metadata via `generateMetadata()`:

**Language Home (`/[lang]/`):**
- Title varies by language
- Description varies by language
- Canonical URL: `/{lang}/`
- Alternate languages for `en` and `tr`

**Post Pages (`/[lang]/[slug]/`):**
- Title from post frontmatter
- Description from post frontmatter
- Canonical URL from post permalink
- Open Graph and Twitter cards

### Example Post Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = getPostBySlug(slug, lang);
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: post.permalink,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: post.permalink,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}
```

## Canonical & Alternate Links

### Language Alternates

Language home pages include alternate links for SEO:

```typescript
alternates: {
  canonical: `/${lang}/`,
  languages: {
    en: "/en/",
    tr: "/tr/",
  },
}
```

This helps search engines understand the relationship between language versions.

## Open Graph & Twitter Cards

Posts include Open Graph metadata for social sharing:

| Property | Source |
|----------|--------|
| `og:title` | Post title |
| `og:description` | Post description |
| `og:type` | `article` |
| `og:url` | Post permalink |
| `article:published_time` | Post date |

Twitter cards use `summary` card type with title and description.

## Theme Color

`ThemeColorMeta` component (`src/components/theme-color-meta/`) dynamically sets the browser theme color based on the current theme:

- Light mode: `#ffffff`
- Dark mode: `#171717`

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
  outDir: "out",
};
```

### Output Files

Generated in `out/`:
- `sitemap.xml` - Sitemap index
- `sitemap-0.xml` - URL entries
- `robots.txt` - Crawler directives

### Robots.txt

Default robots.txt allows all crawlers:

```
User-agent: *
Allow: /

Sitemap: https://doganozturk.dev/sitemap.xml
```

## Structured Data

Currently, the site uses standard Open Graph and Twitter metadata. Structured data (JSON-LD) for articles is not implemented but could be added to post pages for enhanced search results.

## Key Files

| Purpose | Location |
|---------|----------|
| Base metadata | `src/app/layout.tsx` |
| Language home metadata | `src/app/[lang]/page.tsx` |
| Post metadata | `src/app/[lang]/[slug]/page.tsx` |
| Theme color | `src/components/theme-color-meta/` |
| Analytics | `src/app/[lang]/layout.tsx` |
| Sitemap config | `next-sitemap.config.js` |
