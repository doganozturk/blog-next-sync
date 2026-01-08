import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PostSummaryListItem } from "./post-summary-list-item";

describe("PostSummaryListItem", () => {
  const defaultProps = {
    title: "Test Post",
    description: "Test description",
    permalink: "/en/test-post/",
    date: "2025-01-15",
    lang: "en",
  };

  it("renders title", () => {
    render(<PostSummaryListItem {...defaultProps} />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PostSummaryListItem {...defaultProps} />);

    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders title as h2 heading", () => {
    render(<PostSummaryListItem {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Post");
  });

  it("renders arrow icon that is aria-hidden", () => {
    render(<PostSummaryListItem {...defaultProps} />);

    const arrow = screen.getByText("→");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("renders link with correct href", () => {
    render(<PostSummaryListItem {...defaultProps} />);

    const link = screen.getByRole("link");
    // Next.js Link strips trailing slashes in test env
    expect(link.getAttribute("href")).toContain("/en/test-post");
  });

  it("formats date in English locale", () => {
    render(<PostSummaryListItem {...defaultProps} />);

    expect(screen.getByText("January 15, 2025")).toBeInTheDocument();
  });

  it("formats date in Turkish locale when lang is tr", () => {
    render(<PostSummaryListItem {...defaultProps} lang="tr" />);

    expect(screen.getByText("15 Ocak 2025")).toBeInTheDocument();
  });

  it("defaults to English locale for unknown lang", () => {
    render(<PostSummaryListItem {...defaultProps} lang="de" />);

    expect(screen.getByText("January 15, 2025")).toBeInTheDocument();
  });
});
