"use client";

import dynamic from "next/dynamic";

export const ThemeSwitcher = dynamic(
  () =>
    import("./theme-switcher-client").then(
      (module) => module.ThemeSwitcherClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-transparent p-0 text-inherit motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95">
        <span className="invisible flex size-6 items-center justify-center text-xl leading-none">
          &nbsp;
        </span>
      </div>
    ),
  },
);
