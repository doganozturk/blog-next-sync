# Tailwind layout and theme

Ticket #830 supplies the shared reader layout for feature #827. Tailwind v4 and Typography are registered in `src/app/globals.css`; PostCSS configuration and build dependencies stay inside the Blog. Use default utilities for new shared presentation. Georgia is the small font extension that retains the serif heading character. Orange utilities retain the accent.

The HTML class supplied by `next-themes` controls `dark:` utilities. The theme button cycles system, light, and dark. Explicit selection persists across reloads and overrides the device preference. The loading placeholder and button reserve the same 44-pixel square. Motion utilities use `motion-safe:` so reduced-motion readers see stable controls.

The browser floor follows [Tailwind compatibility](https://tailwindcss.com/docs/compatibility): Chrome 111, Safari 16.4, and Firefox 128. Focused tests use the Playwright browser versions locked by the package lockfile. Run `bun run build`, install browsers with `bun x playwright install chromium firefox webkit`, then run `bun run test:browser`. The tests serve the real export with Python 3 on loopback port 8830.

## Migration boundary

The post page owns one Typography wrapper; posts remain unchanged. Shared, article, and media presentation use Tailwind utilities. Ticket #832 removes the two remaining legacy stylesheets and adds blocking authoring lint. `globals.css` is the sole authored styling entry.

## Visual comparison

The pre-migration production export at `127a03804fb1c241d5668bf9e74e69a817629eba` built successfully, generated its sitemap, and optimized 15 images into 255 size outputs. Representative English listing and code-heavy article captures were taken before editing presentation.

Intentional refinements use the default stone palette, the 42rem container scale, default typography leading, and 44-pixel footer targets. Homepage entrance motion is removed; post header, article, and footer entrance motion remains, subject to reduced-motion preference. The reader keeps its avatar, serif headings, orange interaction accent, localized dates and links, and single-column reading layout.

The homepage main paints the adjacent gutters during Safari route changes with the same Tailwind stone palette values as the body. Use native `transition-colors duration-300 ease-in-out motion-reduce:transition-none` on theme-colored surfaces. The main uses `transition` to include the gutter shadow. Arrow opacity and footer icon movement remain separate 150 ms transitions; theme-related hover colors use the shared 300 ms fade. Reduced motion disables these transitions.

The #831 article comparison uses the #830 export at `54f113e97c024a34cab3437cf6a55ce9061b2f6b`. Typography now supplies the default heading, list, blockquote, and code spacing. Images and code blocks extend to both mobile edges, including code blocks inside lists. From `md`, they stay within the reading column; videos stay within the column at every width. Serif headings, orange links, readable code in both themes, and the single-column layout remain. The browser suite checks the exported pages rather than freezing historical pixels.

## Ticket acceptance evidence

| #831 criterion | Verification boundary |
| --- | --- |
| Centralized article styling | One Typography wrapper in the post page; no article corpus or route changes. Heading, list, quote, and code rhythm follow Typography defaults. |
| Syntax tokens and readable code | Production browser checks use generated Shiki spans in light and dark modes and verify long-code scrolling within the block. |
| Responsive images and video | Production browser checks cover English and Turkish article media, thumbnail sizing, pointer and keyboard activation, focus, reduced motion, and no page overflow. |
| CSS Module removal | The image and video modules and their Bun test loader are removed. Ticket #832 removes the remaining shared CSS and leaves one Tailwind entry stylesheet. |
| Standalone export | The isolated Blog production build generates the sitemap and 255 optimized image outputs. Fresh installation of its private PageSpeed CLI requires GitHub Packages read access; the isolated build was verified with that non-build dependency omitted. |
| Contributor guidance | This guide, `docs/styling.md`, and the Blog `AGENTS.md` describe the article wrapper, generated token variables, and lint rules. |

The focused browser suite has eleven cases per engine. Chromium and WebKit run locally; Firefox runs against the same exported files and test source on the Ubuntu 24.04 OrbStack runtime. Feature #827 remains open through integrated acceptance.
