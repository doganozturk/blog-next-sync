# @doganozturk/blog

Personal blog built with Next.js 16, React 19, and MDX.

## Development

```bash
bun dev              # Start development server
bun run build        # Build static site
bun run lint         # Run ESLint
bun test             # Run tests in watch mode
bun test:ci          # Run tests once
bun test:coverage    # Generate coverage report
```

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Runtime:** Bun
- **Content:** MDX with gray-matter frontmatter
- **Styling:** CSS Modules + CSS Variables
- **Theme:** next-themes
- **i18n:** Dynamic `[lang]` route segment (en/tr)
- **Analytics:** Vercel Analytics & Speed Insights
- **SEO:** next-sitemap for sitemap generation
- **Deployment:** Vercel (static export)

## Adding Content

1. Create `content/posts/[en|tr]/[slug]/index.mdx`
2. Include required frontmatter: `title`, `description`, `date`, `permalink`, `lang`
3. Post images go in `public/images/posts/[slug]/`
