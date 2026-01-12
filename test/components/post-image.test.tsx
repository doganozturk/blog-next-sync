import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PostImage } from "@/components/post-image/post-image";

describe("PostImage", () => {
  const defaultProps = {
    src: "/images/posts/test/image.jpg",
    alt: "Test Image",
  };

  it("renders img element", () => {
    render(<PostImage {...defaultProps} />);

    const image = screen.getByAltText("Test Image");
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe("IMG");
  });

  it("has correct alt text", () => {
    render(<PostImage {...defaultProps} />);

    const image = screen.getByAltText("Test Image");
    expect(image).toHaveAttribute("alt", "Test Image");
  });

  it("has default dimensions when not specified", () => {
    render(<PostImage {...defaultProps} />);

    const image = screen.getByAltText("Test Image");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "600");
  });

  it("uses custom dimensions when provided", () => {
    render(<PostImage {...defaultProps} width={1200} height={800} />);

    const image = screen.getByAltText("Test Image");
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
  });

  it("has lazy loading enabled", () => {
    render(<PostImage {...defaultProps} />);

    const image = screen.getByAltText("Test Image");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("has sizes attribute for responsive images", () => {
    render(<PostImage {...defaultProps} />);

    const image = screen.getByAltText("Test Image");
    expect(image).toHaveAttribute(
      "sizes",
      "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
    );
  });

  it("includes src path in image source", () => {
    render(<PostImage {...defaultProps} />);

    const image = screen.getByAltText("Test Image");
    const src = image.getAttribute("src");
    expect(src).toContain("image.jpg");
  });
});
