import { describe, expect, it, mock, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import { ThemeColorMeta } from "./theme-color-meta";

// Mock next-themes
let mockResolvedTheme: string | undefined = "light";

mock.module("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
  }),
}));

describe("ThemeColorMeta", () => {
  beforeEach(() => {
    mockResolvedTheme = "light";
    // Reset meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", "#faf8f5");
    }
  });

  it("renders theme-color meta tag", () => {
    render(<ThemeColorMeta />);

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta).toBeInTheDocument();
  });

  it("renders apple-mobile-web-app-status-bar-style meta tag", () => {
    render(<ThemeColorMeta />);

    const meta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    expect(meta).toBeInTheDocument();
    expect(meta?.getAttribute("content")).toBe("black-translucent");
  });

  it("sets light theme color initially", () => {
    render(<ThemeColorMeta />);

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute("content")).toBe("#faf8f5");
  });

  it("updates meta tag to dark color when theme is dark", () => {
    mockResolvedTheme = "dark";
    render(<ThemeColorMeta />);

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute("content")).toBe("#0c0a09");
  });

  it("uses light color when theme is undefined", () => {
    mockResolvedTheme = undefined;
    render(<ThemeColorMeta />);

    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta?.getAttribute("content")).toBe("#faf8f5");
  });
});
