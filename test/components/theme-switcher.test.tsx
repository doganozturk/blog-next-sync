import { describe, expect, it, mock, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import type { JSX } from "react";
import { ThemeSwitcherClient } from "@/components/theme-switcher/theme-switcher-client";

const mockSetTheme = mock(() => {});
let mockTheme = "system";

mock.module("next/dynamic", () => ({
  default: (
    _loader: unknown,
    options?: { loading?: () => JSX.Element },
  ) => options?.loading ?? (() => null),
}));

mock.module("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeSwitcherClient", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = "system";
  });

  it("renders desktop icon for the system preference", () => {
    render(<ThemeSwitcherClient />);

    expect(
      screen.getByRole("button", {
        name: "Theme: system. Switch to light",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("🖥️")).toBeInTheDocument();
  });

  it("renders sun icon for the light preference", () => {
    mockTheme = "light";
    render(<ThemeSwitcherClient />);

    expect(screen.getByText("🌞")).toBeInTheDocument();
  });

  it("renders moon icon for the dark preference", () => {
    mockTheme = "dark";
    render(<ThemeSwitcherClient />);

    expect(screen.getByText("🌚")).toBeInTheDocument();
  });

  it("switches from system to light", () => {
    render(<ThemeSwitcherClient />);

    const switcher = screen.getByRole("button", {
      name: "Theme: system. Switch to light",
    });
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("switches from light to dark", () => {
    mockTheme = "light";
    render(<ThemeSwitcherClient />);

    const switcher = screen.getByRole("button", {
      name: "Theme: light. Switch to dark",
    });
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("switches from dark to system", () => {
    mockTheme = "dark";
    render(<ThemeSwitcherClient />);

    const switcher = screen.getByRole("button", {
      name: "Theme: dark. Switch to system",
    });
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});

describe("ThemeSwitcher", () => {
  it("renders placeholder loading markup when SSR is disabled", async () => {
    const { ThemeSwitcher } = await import(
      "@/components/theme-switcher/theme-switcher"
    );
    const { container } = render(<ThemeSwitcher />);
    const placeholder = container.querySelector("span");

    expect(placeholder).toBeInTheDocument();
    expect(placeholder?.textContent).toBe("\u00a0");
    expect(screen.queryByText("🖥️")).not.toBeInTheDocument();
    expect(screen.queryByText("🌞")).not.toBeInTheDocument();
    expect(screen.queryByText("🌚")).not.toBeInTheDocument();
  });
});
