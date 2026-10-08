# Blog

The Blog exports static English and Turkish pages. Read [content](docs/content.md) for posts and [styling](docs/styling.md) for presentation changes.

Use [package scripts](package.json) for development, lint, tests, browser tests, and the production build. The browser suite checks the built export. [Root development](../../docs/development.md) describes setup and local work.

[next.config.ts](next.config.ts) owns static export and MDX configuration. [vercel.json](vercel.json) owns hosting routes. [The sync workflow](../../.github/workflows/sync-blog.yml) publishes reviewed source to the public Blog repository.

Check the built pages before reporting a visual change as complete. A local build does not prove public deployment.
