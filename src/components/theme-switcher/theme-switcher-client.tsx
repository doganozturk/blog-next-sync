"use client";

import { useTheme } from "next-themes";
import styles from "./theme-switcher.module.css";

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
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label={`Theme: ${selectedTheme}. Switch to ${nextTheme}`}
    >
      <span className={`${styles.switch} ${styles.switchSelected}`}>
        {themeIcons[selectedTheme]}
      </span>
    </button>
  );
}
