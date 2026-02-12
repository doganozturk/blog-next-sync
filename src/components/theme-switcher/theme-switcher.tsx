"use client";

import dynamic from "next/dynamic";
import styles from "./theme-switcher.module.css";

export const ThemeSwitcher = dynamic(
  () =>
    import("./theme-switcher-client").then(
      (module) => module.ThemeSwitcherClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className={styles.themeSwitcher}>
        <span className={`${styles.switch} ${styles.switchLoading}`}>
          &nbsp;
        </span>
      </div>
    ),
  },
);
