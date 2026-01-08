# Deployment

This document covers the static export configuration, build pipeline, and Vercel deployment setup.

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
  storePicturesInWEBP: "true",
  generateAndUseBlurImages: "true",
  nextImageExportOptimizer_imageFolderPath: "public/images",
  nextImageExportOptimizer_exportFolderPath: "out",
}
```

## Vercel Configuration

### Redirects

`vercel.json` defines 308 (permanent) redirects for legacy English URLs:

```json
{
  "redirects": [
    {
      "source": "/amsterdam-jsnation-2019/",
      "destination": "/en/amsterdam-jsnation-2019/",
      "statusCode": 308
    }
    // ... more legacy redirects
  ]
}
```

These redirects preserve SEO for URLs that existed before the i18n routing was added.

### Bun Version

```json
{
  "build": {
    "env": {
      "ENABLE_EXPERIMENTAL_COREPACK": "1"
    }
  },
  "framework": null
}
```

## Development

```bash
bun dev          # Start development server (Turbopack)
bun run lint     # Run ESLint (flat config in eslint.config.mjs)
bun test         # Run tests in watch mode
bun test:ci      # Run tests once (CI mode)
```

Note: Next.js 16 removed the `next lint` command. ESLint is now run directly via `eslint .` with flat config format.

## Deployment Workflow

1. Push to `main` branch
2. Vercel builds automatically
3. Static files deployed to edge network

No server runtime is required - the entire site is static HTML.
