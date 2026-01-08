import { describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PostHeader } from "./post-header";

// Mock next-themes for ThemeSwitcher used by Header
mock.module("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: () => {},
  }),
}));

describe("PostHeader", () => {
  it("renders back arrow", () => {
    render(<PostHeader />);

    expect(screen.getByText("←")).toBeInTheDocument();
  });

  it("renders site name", () => {
    render(<PostHeader />);

    expect(screen.getByText("doganozturk.dev")).toBeInTheDocument();
  });

  it("back arrow is aria-hidden", () => {
    render(<PostHeader />);

    const arrow = screen.getByText("←");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("renders link to home page with locale", () => {
    render(<PostHeader />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en/");
  });
});
