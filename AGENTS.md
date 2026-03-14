# AGENTS.md

This file provides guidance to coding agents when working with the blog package.

> Source of truth: `package.json`, `next.config.ts`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`, `src/app/[lang]/[slug]/page.tsx`, `src/data/posts/server.ts`, `bunfig.toml`, `test/`, and `vercel.json`.

## Architecture

### Content System
- Blog posts are MDX files in `content/posts/[en|tr]/[slug]/index.mdx`
- Authored frontmatter includes only `title`, `description`, and `date`
- `permalink` and `lang` are derived from folder structure in `src/data/posts/server.ts`
- Post data layer lives in `src/data/posts/`, is server-only, and uses `gray-matter` for frontmatter parsing
- Custom MDX components and helpers are registered in `mdx-components.tsx`

### Routing (App Router with localized static routes)
- Root `/` redirects to `/en/` in `src/app/page.tsx`
- Listing pages live at `/[lang]/` and render via `src/app/[lang]/page.tsx`
- Post pages live at `/[lang]/[slug]/` and render via `src/app/[lang]/[slug]/page.tsx`
- `src/app/layout.tsx` owns root metadata, icons, and manifest configuration
- `src/app/[lang]/layout.tsx` renders `<html>`/`<body>`, sets `lang`, imports global CSS, and mounts `ThemeProvider`, `ThemeColorMeta`, `Analytics`, and `SpeedInsights`
- Static params are generated in `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`, and `src/app/[lang]/[slug]/page.tsx`; post routes also set `dynamicParams = false`
- Post content is loaded from `@content/posts/${lang}/${slug}/index.mdx`
- Legacy English URLs redirect to `/en/` equivalents via explicit rules in `vercel.json`
- Caveat: `src/components/header/header.tsx` currently hardcodes the home link to `/en/`

### Build & Deployment
- Static export is enabled in `next.config.ts` with `output: "export"` and `trailingSlash: true`
- MDX is wired through `@next/mdx`, `remark-frontmatter`, `remark-mdx-frontmatter`, and `rehype-pretty-code`
- `postbuild` runs `next-sitemap` and `next-image-export-optimizer`
- Vercel serves the exported app and applies legacy redirects from `vercel.json`

### Path Aliases
```
~ or @     -> ./src/*
@content   -> ./content/*
@data      -> ./src/data/*
@lib       -> ./src/lib/*
```

### Theme System
- Uses `next-themes` for theme management
- Persists to localStorage and respects system preference
- Theme toggle lives in `src/components/theme-switcher/`

### Styling
- CSS Modules for component styles (`*.module.css`)
- Global style layers are composed from `src/app/globals.css`
- Design tokens live in `src/styles/variables.css`
- `rehype-pretty-code` uses the `dark-plus` theme for code blocks

## Commands

```bash
bun run dev                     # Start the Next.js dev server
bun run build                   # Build the static export and run postbuild tasks
bun run lint                    # Run ESLint
bun run test                    # Run tests in watch mode
bun run test:ci                 # Run tests once (CI mode)
bun run test:coverage           # Generate coverage report
bun run pagespeed:generate-urls # Regenerate pagespeed.urls.txt
bun run pagespeed               # Run PageSpeed analysis on the generated URL list
```

## Shared Memory

- Read the repository root `MEMORY.md` before meaningful work so you inherit cross-workspace context.
- Update the root `MEMORY.md` before finishing when this session adds durable context future agents working on the blog should know.

## Key Files

| Purpose | Location |
|---------|----------|
| Next.js config | `next.config.ts` |
| Blog content | `content/posts/` |
| Source code | `src/` |
| MDX components | `mdx-components.tsx` |
| Test runtime preload | `bunfig.toml` |
| PageSpeed URL generation | `scripts/generate-pagespeed-urls.ts` |
| PageSpeed URL artifact | `pagespeed.urls.txt` |
| Vercel redirects | `vercel.json` |

## Testing

Tests use Bun's native test runner with `@testing-library/react`. `bunfig.toml` preloads `test/css-modules.ts`, `test/happydom.ts`, and `test/setup.ts` before the suite runs.

```text
test/
├── setup.ts              # Test setup and mocks
├── happydom.ts           # Happy DOM registration
├── css-modules.ts        # CSS modules plugin
├── components/           # Component tests
│   ├── footer.test.tsx
│   ├── header/
│   │   ├── header.test.tsx
│   │   ├── main-header.test.tsx
│   │   └── post-header.test.tsx
│   ├── post-image.test.tsx
│   ├── post-summary-list/
│   │   ├── post-summary-list.test.tsx
│   │   └── post-summary-list-item.test.tsx
│   ├── post-video.test.tsx
│   ├── theme-color-meta.test.tsx
│   └── theme-switcher.test.tsx
├── data/posts/           # Data layer tests
│   ├── server.test.ts
│   └── types.test.ts
└── lib/
    └── format-date.test.ts
```

## CI/CD

### GitHub Actions
- Uses path-based change detection
- Blog changes trigger blog jobs only
- Root config changes (`bun.lock`, `package.json`) trigger all jobs

### Vercel Deployment
- Deployed to Vercel as a static export
- `postbuild` generates the sitemap and optimized images for the exported output
- Configure in Vercel UI: Root Directory = `apps/blog`
