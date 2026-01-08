import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PostSummaryList } from "./post-summary-list";
import type { PostSummary } from "./post-summary-list-item/post-summary-list-item";

const mockPosts: PostSummary[] = [
  {
    title: "First Post",
    description: "Description of first post",
    permalink: "/en/first-post/",
    date: "2025-01-15",
    lang: "en",
  },
  {
    title: "Second Post",
    description: "Description of second post",
    permalink: "/en/second-post/",
    date: "2025-01-10",
    lang: "en",
  },
];

describe("PostSummaryList", () => {
  it("renders nothing when data is empty", () => {
    render(<PostSummaryList data={[]} />);

    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(0);
  });

  it("renders correct number of items", () => {
    render(<PostSummaryList data={mockPosts} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("renders all post titles", () => {
    render(<PostSummaryList data={mockPosts} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("renders all post descriptions", () => {
    render(<PostSummaryList data={mockPosts} />);

    expect(screen.getByText("Description of first post")).toBeInTheDocument();
    expect(screen.getByText("Description of second post")).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    render(<PostSummaryList data={mockPosts} />);

    const links = screen.getAllByRole("link");
    // Next.js Link strips trailing slashes in test env
    expect(links[0].getAttribute("href")).toContain("/en/first-post");
    expect(links[1].getAttribute("href")).toContain("/en/second-post");
  });
});
