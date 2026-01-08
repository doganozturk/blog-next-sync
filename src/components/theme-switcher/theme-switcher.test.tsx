import { describe, expect, it, mock, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSwitcher } from "./theme-switcher";

// Mock next-themes
const mockSetTheme = mock(() => {});
let mockResolvedTheme = "light";

mock.module("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockResolvedTheme = "light";
  });

  it("renders moon icon in light mode", () => {
    mockResolvedTheme = "light";
    render(<ThemeSwitcher />);

    expect(screen.getByText("🌚")).toBeInTheDocument();
  });

  it("renders sun icon in dark mode", () => {
    mockResolvedTheme = "dark";
    render(<ThemeSwitcher />);

    expect(screen.getByText("🌞")).toBeInTheDocument();
  });

  it("calls setTheme with 'dark' when clicking in light mode", () => {
    mockResolvedTheme = "light";
    render(<ThemeSwitcher />);

    const switcher = screen.getByText("🌚").parentElement!;
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when clicking in dark mode", () => {
    mockResolvedTheme = "dark";
    render(<ThemeSwitcher />);

    const switcher = screen.getByText("🌞").parentElement!;
    fireEvent.click(switcher);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
