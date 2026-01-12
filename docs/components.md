# Components

This document describes the component architecture and available components.

> **Source of truth:** `src/components/`, `mdx-components.tsx`

## Overview

Components are organized by feature in `src/components/`:

```
src/components/
├── footer/
├── header/
│   ├── main-header/
│   └── post-header/
├── post-image/
├── post-summary-list/
│   └── post-summary-list-item/
├── post-video/
├── theme-color-meta/
└── theme-switcher/
```

## Layout Components

### Header

The `Header` component (`src/components/header/header.tsx`) provides the site header wrapper:

```tsx
type HeaderType = "main" | "post";

interface HeaderProps {
  type: HeaderType;
  children: React.ReactNode;
}
```

- Wraps children in a `<header>` element
- Links header content to home page (`/en/`)
- Uses CSS Modules for styling

**Note:** The home link is currently hardcoded to `/en/`, so Turkish pages link back to the English home.

### MainHeader

The `MainHeader` component (`src/components/header/main-header/`) renders the full site header with avatar:

- Displays author avatar (optimized via `next-image-export-optimizer`)
- Shows site title and subtitle
- Used on language home pages

### PostHeader

The `PostHeader` component (`src/components/header/post-header/`) renders a minimal header for post pages:

- Shows `doganozturk.dev` as a back link
- Simpler styling for content-focused pages

### Footer

The `Footer` component (`src/components/footer/footer.tsx`) renders the site footer:

- Social links (GitHub, LinkedIn, Bluesky, Twitter/X)
- Uses SVG icons inline
- Copyright notice

## Post Listing

### PostSummaryList

Renders a list of post summaries:

```tsx
interface PostSummaryListProps {
  data: PostFrontmatter[];
}
```

Maps over posts and renders `PostSummaryListItem` for each.

### PostSummaryListItem

Renders a single post preview:

```tsx
interface PostSummaryListItemProps {
  title: string;
  description: string;
  permalink: string;
  date: string;
  lang: Lang;
}
```

- Links to post via `permalink`
- Formats date using `formatDate()` with locale derived from `lang`
- Displays title and description

## MDX Components

These components are registered in `mdx-components.tsx` and available in all MDX content.

### PostImage

Renders an optimized image:

```tsx
interface PostImageProps {
  src: string;
  alt: string;
  width?: number;  // default: 800
  height?: number; // default: 600
}
```

- Uses `next-image-export-optimizer` for static export optimization
- Wrapped in `<figure>` with `<figcaption>` from alt text
- Default dimensions: 800x600

**Usage in MDX:**

```jsx
<PostImage
  src="/images/posts/my-post/screenshot.png"
  alt="Screenshot of the application"
/>
```

### PostVideo

Renders a lazy-loaded YouTube embed:

```tsx
interface PostVideoProps {
  id: string;    // YouTube video ID
  title: string; // Video title for accessibility
}
```

- Shows YouTube thumbnail initially
- Loads iframe on click (performance optimization)
- Maintains 16:9 aspect ratio
- Includes play button overlay

**Usage in MDX:**

```jsx
<PostVideo
  id="dQw4w9WgXcQ"
  title="Introduction to Web Components"
/>
```

## Theme Components

### ThemeSwitcher

Toggle between light and dark themes:

```tsx
// No props - uses next-themes internally
```

- Uses `useTheme()` from `next-themes`
- Renders sun/moon icons based on current theme
- Handles hydration with "mounted" state pattern
- Shows placeholder during SSR to avoid flash

### ThemeColorMeta

Updates browser chrome color based on theme:

```tsx
// No props - uses next-themes internally

const THEME_COLORS = {
  light: "#faf8f5",
  dark: "#0c0a09",
};
```

- Sets `<meta name="theme-color">` dynamically
- Adds `<meta name="apple-mobile-web-app-status-bar-style">`
- Updates on theme change via `useEffect`

## Styling Pattern

All components use CSS Modules:

```
component-name/
├── component-name.tsx
└── component-name.module.css
```

Import styles as:

```tsx
import styles from "./component-name.module.css";
```

## Testing

Component tests are located in `test/components/`, mirroring the `src/components/` structure. See [testing.md](./testing.md) for test setup details.
