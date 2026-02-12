import { describe, expect, it, mock, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSwitcherClient } from "@/components/theme-switcher/theme-switcher-client";

const mockSetTheme = mock(() => {});
let mockResolvedTheme = "light";

mock.module("next/dynamic", () => ({
  default: (
    _loader: unknown,
    options?: { loading?: () => JSX.Element },
  ) => options?.loading ?? (() => null),
}));

mock.module("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeSwitcherClient", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockResolvedTheme = "light";
  });

  it("renders moon icon in light mode", () => {
    mockResolvedTheme = "light";
    render(<ThemeSwitcherClient />);

    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
    expect(screen.getByText("🌚")).toBeInTheDocument();
  });

  it("renders sun icon in dark mode", () => {
    mockResolvedTheme = "dark";
    render(<ThemeSwitcherClient />);

    expect(screen.getByText("🌞")).toBeInTheDocument();
  });

  it("calls setTheme with 'dark' when clicking in light mode", () => {
    mockResolvedTheme = "light";
    render(<ThemeSwitcherClient />);

    const switcher = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when clicking in dark mode", () => {
    mockResolvedTheme = "dark";
    render(<ThemeSwitcherClient />);

    const switcher = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
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
    expect(screen.queryByText("🌞")).not.toBeInTheDocument();
    expect(screen.queryByText("🌚")).not.toBeInTheDocument();
  });
});
