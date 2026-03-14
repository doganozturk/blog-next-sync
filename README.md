# @doganozturk/blog

Personal blog built with Next.js 16, React 19, and MDX.

> Source of truth: `package.json`, `next.config.ts`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`, `src/app/[lang]/[slug]/page.tsx`, `src/data/posts/server.ts`, `bunfig.toml`, and `vercel.json`.

## Development

```bash
bun run dev                     # Start the Next.js dev server
bun run build                   # Build the static export and run postbuild tasks
bun run lint                    # Run ESLint
bun run test                    # Run tests in watch mode
bun run test:ci                 # Run tests once
bun run test:coverage           # Generate coverage report
bun run pagespeed:generate-urls # Regenerate pagespeed.urls.txt
bun run pagespeed               # Run PageSpeed analysis for the generated URL list
```

## Tech Stack

- **Framework:** Next.js 16 with App Router and React 19
- **Build/export:** Static export via `output: "export"` with trailing slashes
- **Content:** MDX posts in `content/posts/` with frontmatter parsed by `gray-matter`
- **Routing:** Localized `/[lang]/` and `/[lang]/[slug]/` routes, with `/` redirecting to `/en/`
- **Styling:** CSS Modules + CSS variables
- **Theme:** `next-themes`
- **Testing:** Bun test runner with Happy DOM and Testing Library
- **Analytics:** Vercel Analytics & Speed Insights
- **SEO:** `next-sitemap` plus legacy redirects from `vercel.json`
- **Deployment:** Vercel static export

## Adding Content

1. Create `content/posts/[en|tr]/[slug]/index.mdx`
2. Include authored frontmatter: `title`, `description`, `date`
3. `permalink` and `lang` are derived from the folder structure by `src/data/posts/server.ts`
4. Post images go in `public/images/posts/[slug]/`
