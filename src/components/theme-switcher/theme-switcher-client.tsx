"use client";

import { useTheme } from "next-themes";

const themeOptions = ["system", "light", "dark"] as const;

type ThemeOption = (typeof themeOptions)[number];

const themeIcons: Record<ThemeOption, string> = {
  system: "🖥️",
  light: "🌞",
  dark: "🌚",
};

export function ThemeSwitcherClient() {
  const { theme, setTheme } = useTheme();
  const selectedTheme: ThemeOption =
    theme === "light" || theme === "dark" ? theme : "system";
  const nextTheme =
    themeOptions[(themeOptions.indexOf(selectedTheme) + 1) % themeOptions.length];

  const toggleTheme = () => {
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-transparent p-0 text-inherit motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95"
      onClick={toggleTheme}
      aria-label={`Theme: ${selectedTheme}. Switch to ${nextTheme}`}
    >
      <span className="flex size-6 items-center justify-center text-xl leading-none">
        {themeIcons[selectedTheme]}
      </span>
    </button>
  );
}
