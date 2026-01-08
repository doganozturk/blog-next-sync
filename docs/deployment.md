# Deployment

This document covers the static export configuration, build pipeline, and Vercel deployment setup.

> **Source of truth:** `next.config.ts`, `package.json`, `next-sitemap.config.js`, `vercel.json`

## Static Export

The site is statically exported for deployment to Vercel (or any static host).

### Next.js Configuration

Key settings in `next.config.ts`:

```typescript
{
  output: "export",           // Static HTML export
  trailingSlash: true,        // URLs end with /
  images: {
    loader: "custom",         // Uses next-image-export-optimizer
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### Output

Static files are generated to the `out/` directory during build.

## Build Pipeline

### Scripts

```bash
bun run build    # Runs next build + postbuild
```

The build process:

1. **`next build`** - Generates static HTML/CSS/JS to `out/`
2. **`postbuild`** (automatic) - Runs after build:
   - `next-sitemap` - Generates sitemap and robots.txt
   - `next-image-export-optimizer` - Optimizes images for static export

### Full Command Chain

```
bun run build
  └── next build
        └── postbuild (lifecycle hook)
              ├── next-sitemap
              └── next-image-export-optimizer
```

## Sitemap & Robots

Configuration in `next-sitemap.config.js`:

```javascript
module.exports = {
  siteUrl: "https://doganozturk.dev",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "out",
};
```

Output files in `out/`:
- `sitemap.xml`
- `robots.txt`

## Image Optimization

For static export, images are pre-optimized at build time using `next-image-export-optimizer`.

Environment variables in `next.config.ts`:

```typescript
env: {
  nextImageExportOptimizer_imageFolderPath: "public/images",
  nextImageExportOptimizer_exportFolderPath: "out",
  nextImageExportOptimizer_quality: "80",
  nextImageExportOptimizer_storePicturesInWEBP: "true",
  nextImageExportOptimizer_generateAndUseBlurImages: "true",
}
```

## Vercel Configuration

### Routes Format

`vercel.json` uses the `routes` format (not `redirects`) for legacy URL redirects:

```json
{
  "bunVersion": "1.x",
  "routes": [
    {
      "src": "/amsterdam-jsnation-2019(/.*)?",
      "status": 308,
      "headers": { "Location": "/en/amsterdam-jsnation-2019$1" }
    }
  ]
}
```

Key points:
- **308 status**: Permanent redirect (preserves HTTP method)
- **Regex capture**: `(/.*)?` captures optional trailing path
- **Path preservation**: `$1` appends captured path to destination

### Legacy Redirects

All legacy English URLs (without language prefix) redirect to `/en/...`:

| Legacy URL | Redirects To |
|------------|--------------|
| `/amsterdam-jsnation-2019/` | `/en/amsterdam-jsnation-2019/` |
| `/web-components/` | `/en/web-components/` |
| `/javascript-basics-hoisting/` | `/en/javascript-basics-hoisting/` |
| ... | ... |

These redirects preserve SEO for URLs that existed before i18n routing was added.

### Bun Version

```json
{
  "bunVersion": "1.x"
}
```

## Development

```bash
bun dev          # Start development server (Turbopack)
bun run lint     # Run ESLint (eslint .)
bun test         # Run tests in watch mode
bun test:ci      # Run tests once (CI mode)
```

## Deployment Workflow

1. Push to `main` branch
2. Vercel builds automatically
3. Static files deployed to edge network

No server runtime is required - the entire site is static HTML.

## PageSpeed Analysis

Run PageSpeed Insights on deployed URLs:

```bash
bun run pagespeed                    # Analyze URLs from pagespeed.urls.txt
bun run pagespeed:generate-urls      # Regenerate URL list from posts
```

The `pagespeed.urls.txt` file contains all deployed post URLs for performance monitoring.
