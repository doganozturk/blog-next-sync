import { describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MainHeader } from "@/components/header/main-header/main-header";
import styles from "@/components/header/main-header/main-header.module.css";

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

  it("renders avatar with eager loading", () => {
    render(<MainHeader />);

    const avatar = screen.getByAltText("Doğan Öztürk");
    expect(avatar).toHaveAttribute("loading", "eager");
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

    const info = screen.getByText(/REFLECTIONS ON TECHNOLOGY,/);
    expect(info).toHaveTextContent(
      "REFLECTIONS ON TECHNOLOGY, CULTURE, AND LIFE"
    );
    expect(screen.getByText("CULTURE, AND LIFE")).toHaveClass(
      styles.infoContinuation
    );
  });

  it("renders link to home page with locale", () => {
    render(<MainHeader />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en");
  });
});
