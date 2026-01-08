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
