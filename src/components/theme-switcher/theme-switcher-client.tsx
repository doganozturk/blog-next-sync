"use client";

import { useTheme } from "next-themes";
import styles from "./theme-switcher.module.css";

export function ThemeSwitcherClient() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" && (
        <span className={`${styles.switch} ${styles.switchLight}`}>🌞</span>
      )}
      {resolvedTheme === "light" && (
        <span className={`${styles.switch} ${styles.switchDark}`}>🌚</span>
      )}
    </button>
  );
}
