import { describe, expect, it } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { PostVideo } from "@/components/post-video/post-video";

describe("PostVideo", () => {
  const defaultProps = {
    id: "dQw4w9WgXcQ",
    title: "Test Video",
  };

  it("renders thumbnail button initially (not iframe)", () => {
    render(<PostVideo {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: `Play video: ${defaultProps.title}`,
    });
    expect(button).toBeInTheDocument();

    // Should NOT have iframe initially
    expect(screen.queryByTitle(defaultProps.title)).not.toBeInTheDocument();
  });

  it("renders thumbnail image with correct src", () => {
    render(<PostVideo {...defaultProps} />);

    const img = screen.getByAltText(defaultProps.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      `https://img.youtube.com/vi/${defaultProps.id}/maxresdefault.jpg`
    );
  });

  it("thumbnail image has lazy loading enabled", () => {
    render(<PostVideo {...defaultProps} />);

    const img = screen.getByAltText(defaultProps.title);
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("loads iframe when thumbnail is clicked", () => {
    render(<PostVideo {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: `Play video: ${defaultProps.title}`,
    });
    fireEvent.click(button);

    // Now iframe should be present
    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");
  });

  it("iframe has correct YouTube embed URL with autoplay", () => {
    render(<PostVideo {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: `Play video: ${defaultProps.title}`,
    });
    fireEvent.click(button);

    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute(
      "src",
      `https://www.youtube.com/embed/${defaultProps.id}?autoplay=1`
    );
  });

  it("iframe has correct dimensions", () => {
    render(<PostVideo {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: `Play video: ${defaultProps.title}`,
    });
    fireEvent.click(button);

    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute("width", "560");
    expect(iframe).toHaveAttribute("height", "315");
  });

  it("iframe has allowFullScreen attribute", () => {
    render(<PostVideo {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: `Play video: ${defaultProps.title}`,
    });
    fireEvent.click(button);

    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute("allowfullscreen");
  });

  it("iframe has correct allow attribute for media features", () => {
    render(<PostVideo {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: `Play video: ${defaultProps.title}`,
    });
    fireEvent.click(button);

    const iframe = screen.getByTitle(defaultProps.title);
    expect(iframe).toHaveAttribute(
      "allow",
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    );
  });
});
