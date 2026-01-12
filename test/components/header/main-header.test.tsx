import { describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MainHeader } from "@/components/header/main-header/main-header";

// Mock next-themes for ThemeSwitcher used by Header
mock.module("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: () => {},
  }),
}));

describe("MainHeader", () => {
  it("renders avatar image with correct alt text", () => {
    render(<MainHeader />);

    const avatar = screen.getByAltText("Doğan Öztürk");
    expect(avatar).toBeInTheDocument();
  });

  it("renders avatar with priority loading", () => {
    render(<MainHeader />);

    const avatar = screen.getByAltText("Doğan Öztürk");
    expect(avatar).toHaveAttribute("data-priority", "true");
  });

  it("renders avatar with correct dimensions", () => {
    render(<MainHeader />);

    const avatar = screen.getByAltText("Doğan Öztürk");
    expect(avatar).toHaveAttribute("width", "100");
    expect(avatar).toHaveAttribute("height", "100");
  });

  it("renders name heading", () => {
    render(<MainHeader />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Doğan Öztürk");
  });

  it("renders info text", () => {
    render(<MainHeader />);

    expect(
      screen.getByText("REFLECTIONS ON TECHNOLOGY, CULTURE, AND LIFE")
    ).toBeInTheDocument();
  });

  it("renders link to home page with locale", () => {
    render(<MainHeader />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/");
  });
});
