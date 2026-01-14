# Theming System

> How dark/light mode works with persistence

## Overview

The blog supports dark and light themes with automatic system preference detection and manual toggling. It uses the `next-themes` library to handle the complexity of server-side rendering with client-side theme state. The theme choice persists in localStorage and applies immediately on page load to avoid flash of wrong theme.

The key challenge with theming in SSR: the server doesn't know the user's preference, so you need to handle the initial render carefully.

## The Theme Flow

```
Page Load
    │
    ▼
┌─────────────────┐
│  ThemeProvider  │  Injects theme class
│  (next-themes)  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌─────────────┐
│<html   │ │ localStorage │
│class>  │ │  "theme"     │
└────────┘ └─────────────┘
         │
         ▼
┌─────────────────┐
│ ThemeSwitcher   │  Toggle button
│ ThemeColorMeta  │  Browser theme-color
└─────────────────┘
```

## Theme Provider Setup

The provider wraps the entire app in the language layout:

```typescript
// From src/app/[lang]/layout.tsx:20-39
export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <ThemeColorMeta />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="theme-container">
            <div className="container">{children}</div>
          </div>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

**Configuration explained:**
- `attribute="class"` - Adds theme class to `<html>` (`class="dark"` or `class="light"`)
- `defaultTheme="system"` - Respects OS preference initially
- `enableSystem` - Listens to system preference changes
- `disableTransitionOnChange={false}` - Allows smooth transitions

The `suppressHydrationWarning` attributes prevent React warnings when the client hydrates with a different theme than the server rendered.

## Theme Switcher Component

The toggle button lives in the header:

```typescript
// From src/components/theme-switcher/theme-switcher.tsx:1-41
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./theme-switcher.module.css";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className={styles.themeSwitcher}>
        <span className={`${styles.switch} ${styles.switchLoading}`}>
          &nbsp;
        </span>
      </div>
    );
  }

  return (
    <div className={styles.themeSwitcher} onClick={toggleTheme}>
      {resolvedTheme === "dark" && (
        <span className={`${styles.switch} ${styles.switchLight}`}>🌞</span>
      )}
      {resolvedTheme === "light" && (
        <span className={`${styles.switch} ${styles.switchDark}`}>🌚</span>
      )}
    </div>
  );
}
```

**The mount pattern is critical:**

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <LoadingState />;
}
```

Why? During SSR, we don't know the theme. If we render the sun/moon icon based on `resolvedTheme` immediately, there will be a hydration mismatch. The loading state ensures:
1. Server renders a neutral placeholder
2. Client hydrates with same placeholder
3. After mount, we know the actual theme and render the correct icon

## Theme Color Meta

The browser UI (address bar, etc.) should match the theme:

```typescript
// From src/components/theme-color-meta/theme-color-meta.tsx:1-32
"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_COLORS = {
  light: "#faf8f5",
  dark: "#0c0a09",
} as const;

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color =
      THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS] ??
      THEME_COLORS.light;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, [resolvedTheme]);

  return (
    <>
      <meta name="theme-color" content={THEME_COLORS.light} />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
    </>
  );
}
```

**How it works:**
1. Renders initial meta tag with light theme color (server-safe)
2. On mount, effect runs and updates the meta tag to match actual theme
3. When theme changes, effect runs again

The `theme-color` meta tag affects:
- Safari's address bar color
- Chrome's toolbar color on Android
- PWA status bar color

## CSS Variables

The actual colors are defined in CSS using variables:

```css
/* From src/styles/variables.css (conceptual) */
:root {
  --background: #faf8f5;
  --text: #0c0a09;
  /* ... other colors */
}

.dark {
  --background: #0c0a09;
  --text: #faf8f5;
  /* ... dark mode colors */
}
```

Components use these variables:

```css
.container {
  background-color: var(--background);
  color: var(--text);
}
```

When `next-themes` adds `class="dark"` to `<html>`, all variable references automatically resolve to dark mode values.

## How next-themes Works

Under the hood, `next-themes`:

1. **Injects a script** before React hydrates to set the class immediately (no flash)
2. **Reads localStorage** for saved preference
3. **Listens to `prefers-color-scheme`** media query
4. **Provides React context** with `resolvedTheme` and `setTheme`

The `resolvedTheme` is either `"light"` or `"dark"` - it resolves `"system"` to the actual value.

## Avoiding Flash of Wrong Theme

The classic problem: server renders light, user prefers dark, page flashes light then dark.

`next-themes` solves this by:
1. Injecting a blocking `<script>` in `<head>`
2. This script reads localStorage and sets the class BEFORE paint
3. CSS applies immediately with the correct theme

The `suppressHydrationWarning` allows React to accept that the HTML attribute differs from what it would have rendered.

## Theme Persistence

`next-themes` stores the preference in localStorage under the key `theme`:

```javascript
localStorage.setItem("theme", "dark");  // User clicked toggle
localStorage.getItem("theme");          // Returns "dark", "light", or null
```

When `theme` is null or "system", it follows the OS preference.

## Complete Theme Toggle Flow

```
User clicks 🌞 (currently in dark mode)
              │
              ▼
    ┌─────────────────┐
    │ setTheme("light")│  ThemeSwitcher calls setTheme
    └────────┬────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌────────────┐  ┌─────────────┐
│ localStorage│  │ <html class>│
│ theme=light │  │ class=light │
└────────────┘  └─────────────┘
             │
             ▼
    ┌─────────────────┐
    │ CSS variables   │  All --var() values flip
    │ :root → .light  │
    └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ThemeColorMeta   │  Updates <meta theme-color>
    │ useEffect runs  │
    └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ThemeSwitcher    │  Icon changes to 🌚
    │ re-renders      │
    └─────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/[lang]/layout.tsx` | ThemeProvider setup |
| `src/components/theme-switcher/theme-switcher.tsx` | Toggle button component |
| `src/components/theme-color-meta/theme-color-meta.tsx` | Browser theme-color sync |
| `src/styles/variables.css` | CSS variables for colors |

## Related Paths

- [Internationalization](./internationalization.md) - Layout structure that contains ThemeProvider
