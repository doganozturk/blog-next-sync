# Styling

Shared layout, headers, footer, listings, and theme controls use Tailwind v4 utilities. Keep the current components and use the default palette and spacing scales. Georgia headings and orange interaction accents preserve the Blog's visual identity. See [the migration guide](tailwind-migration.md) for the ticket boundary and verification commands.

## Configuration

`src/app/globals.css` is the Tailwind entry. It imports Tailwind, registers the official Typography plugin, declares the class-based dark variant, and extends the serif font family and post entrance animations. `postcss.config.json` loads the Tailwind PostCSS plugin. Configuration and build dependencies belong to the Blog so the standalone copy can build.

`globals.css` is the only authored presentation stylesheet. Tailwind generates the utility and Typography styles. Its `.homepage-main` rule paints the gutters during Safari route changes with the Tailwind stone palette. Native transition, duration, easing, and reduced-motion utilities on theme-colored elements preserve the 300 ms color fade. Keep other shared presentation in utilities; do not add CSS Modules.

## Shared components

Write shared presentation in `className` using Tailwind defaults. For example:

```tsx
<div className="px-4 text-stone-900 dark:text-stone-50 md:px-6">
  {children}
</div>
```

Use `md:` for the 768px responsive transition. Keep focus visible and controls usable by keyboard and touch. Use `motion-safe:` for optional animation and transitions. The theme placeholder and hydrated button must reserve the same 44-pixel square.

## Themes

`next-themes` writes the resolved `light` or `dark` class on `<html>`. It persists explicit selection and follows device preference in system mode. Tailwind's `dark:` variant follows this class. The provider resolves system preference before page display.

The only Blog theme extension is the Georgia serif font. Use Tailwind's default palette and scales for other presentation. The class-based `dark:` variant respects explicit and system theme selection.

## Articles and media

The post page applies `prose prose-stone dark:prose-invert` to its `<article>` wrapper. Limited heading, link, code, and syntax-token modifiers live on that wrapper, so MDX posts need no styling annotations. Typography sets heading, list, blockquote, and code-block rhythm. Inline code uses rounded stone backgrounds, orange text, normal weight, and default Tailwind padding in both themes; generated backticks are removed. The background and padding apply only outside code blocks. Keep prose width inside the shared reader container. On mobile, images and code figures extend across the reader gutters; list-contained code figures also cancel the Typography list inset. Article pages release the reader width cap below `md`; from `md`, images and code stay inside the reader column. Video frames stay within the column at every width. Code blocks keep their inner padding and horizontal scroll, with square mobile edges and rounded desktop corners.

`PostImage` and `PostVideo` use component-local utilities for responsive sizing. The video thumbnail remains a button and creates its iframe on activation. Its optional hover and focus animation uses `motion-safe:`; the focus ring stays inside the video frame.

`rehype-pretty-code` emits `<figure data-rehype-pretty-code-figure><pre><code><span>` for highlighted blocks. Article descendant utilities read the generated `--shiki-light` and `--shiki-dark` token variables, including optional font style, weight, and decoration values. These generated inline variables and the generated code-grid display style are permitted. They do not justify authored inline presentation styles.

## Blocking lint rules

`bun run lint` compiles `globals.css` with the installed Tailwind compiler before running ESLint. It requires the Blog serif extension, Typography plugin, and class-based dark variant in generated CSS. The wrapper treats any shadcn/lint warning as a failure, including a warning-backed grammar fallback. A missing or unusable entry also fails the command. Command fixtures prove that plugin-only `prose` passes and misspelled `hovr:flex` receives a Tailwind correction. `BLOG_TAILWIND_ENTRY` is used only by command-level failure fixtures.

The Blog ESLint config enables `shadcn/no-unknown-classes`, `shadcn/no-arbitrary-values`, and `shadcn/no-inline-styles` as errors in source components and MDX posts. The MDX parser checks authored JSX in `content/posts/`; JavaScript unused-expression and unused-variable rules are disabled there because they mistake article markup and imports used by MDX for unused code. The unknown-class rule checks against the compiled Tailwind theme and suggests corrections. The arbitrary-value rule prefers defaults and permits only the eight exact Shiki token utilities on the article wrapper; these variables come from generated syntax markup. The inline-style rule rejects authored JSX styles and style elements, while generated Shiki token variables remain outside its authored-source boundary. The linter does not prove that every CSS custom-property reference resolves.

`no-raw-colors` is excluded because the accepted design uses Tailwind's default palette. `no-restyle` and `require-static-classes` are excluded because the current Blog components expose no caller `className` styling contract or variant API. Add a component rule only if a real caller customization boundary is introduced. Keep any future exception narrow and explain its generated source.

## Verification

Run `bun run lint`, `bun run typecheck`, `bun run test:ci`, and `bun run build` from the Blog. Run `bun run test:browser` against that export for theme, navigation, focus, responsive, loading-footprint, and video checks. The lint command fixtures in `test/scripts/tailwind-lint.test.ts` check supported classes, actionable errors, and missing theme failures. The [migration guide](tailwind-migration.md) records the browser support floor and standalone verification.
