import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders all 4 social links", () => {
    render(<Footer />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("X")).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
  });

  it("has correct href for Email link", () => {
    render(<Footer />);

    const emailLink = screen.getByLabelText("Email");
    expect(emailLink).toHaveAttribute("href", "mailto:doganozturk2005@gmail.com");
  });

  it("has correct href for X link", () => {
    render(<Footer />);

    const xLink = screen.getByLabelText("X");
    expect(xLink).toHaveAttribute("href", "https://x.com/dodothebird");
    expect(xLink).toHaveAttribute("target", "_blank");
    expect(xLink).toHaveAttribute("rel", "noopener");
  });

  it("has correct href for GitHub link", () => {
    render(<Footer />);

    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/doganozturk");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener");
  });

  it("has correct href for LinkedIn link", () => {
    render(<Footer />);

    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/doganozturk"
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener");
  });

  it("renders SVG icons for each link", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);

    links.forEach((link) => {
      const svg = link.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });
});
