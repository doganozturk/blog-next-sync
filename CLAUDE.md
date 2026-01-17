# CLAUDE.md

This file provides guidance to Claude Code when working with the blog package.

## Architecture

### Content System
- Blog posts are MDX files in `content/posts/[en|tr]/[slug]/index.mdx`
- Frontmatter includes: `title`, `description`, `date`
- `permalink` and `lang` are derived from folder structure (not in frontmatter)
- Post data layer in `src/data/posts/` (server-only with `gray-matter`)
- Custom MDX components registered in `mdx-components.tsx`

### Routing (App Router with i18n)
- Root `/` redirects to `/en/`
- English posts: `/en/[slug]/` -> `src/app/[lang]/[slug]/page.tsx`
- Turkish posts: `/tr/[slug]/` -> `src/app/[lang]/[slug]/page.tsx`
- Language-specific layout: `src/app/[lang]/layout.tsx` sets `<html lang>`
- Static params generated via `generateStaticParams()` and `generateMetadata()`
- Legacy English URLs redirect to `/en/` equivalents via explicit rules in `vercel.json`

### Path Aliases
```
~ or @     -> ./src/*
@content   -> ./content/*
@data      -> ./src/data/*
@lib       -> ./src/lib/*
```

### Theme System
- Uses `next-themes` library for theme management
- Persisted to localStorage, respects system preference
- Theme toggle in `src/components/theme-switcher/theme-switcher.tsx`

### Styling
- CSS Modules for component styles (`*.module.css`)
- Design tokens in `src/styles/variables.css`
- rehype-pretty-code for syntax highlighting (dark-plus theme)

## Commands

```bash
bun dev              # Start development server
bun run build        # Build static site (runs postbuild automatically)
bun run lint         # Run ESLint
bun test             # Run tests in watch mode
bun test:ci          # Run tests once (CI mode)
bun test:coverage    # Generate coverage report
bun run pagespeed    # Run PageSpeed analysis on blog URLs
```

## Key Files

| Purpose | Location |
|---------|----------|
| Next.js config | `next.config.ts` |
| Blog content | `content/posts/` |
| Source code | `src/` |
| MDX components | `mdx-components.tsx` |
| Vercel redirects | `vercel.json` |

## Testing

Tests use Bun's native test runner with @testing-library/react. All tests are located in the `test/` folder, mirroring the `src/` structure:

```
test/
├── setup.ts              # Test setup and mocks
├── happydom.ts           # HappyDOM registration
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
│   ├── server-errors.test.ts
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
- Deployed to Vercel as static export
- Configure in Vercel UI: Root Directory = `apps/blog`
