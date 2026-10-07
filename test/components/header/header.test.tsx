import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";

describe("Header", () => {
  it("renders children", async () => {
    const { Header, HeaderType } = await import("@/components/header/header");
    render(
      <Header type={HeaderType.Main}>
        <span>Test Child</span>
      </Header>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders the theme control's loading placeholder", async () => {
    const { Header, HeaderType } = await import("@/components/header/header");
    render(
      <Header type={HeaderType.Main}>
        <span>Content</span>
      </Header>
    );

    expect(
      screen.getByText("\u00a0", { normalizer: (text) => text }),
    ).toBeInTheDocument();
  });

  it("renders link to home page with locale", async () => {
    const { Header, HeaderType } = await import("@/components/header/header");
    render(
      <Header type={HeaderType.Main}>
        <span>Content</span>
      </Header>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en");
  });

  it("has aria-label='back' when type is Post", async () => {
    const { Header, HeaderType } = await import("@/components/header/header");
    render(
      <Header type={HeaderType.Post}>
        <span>Content</span>
      </Header>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "back");
  });

  it("has no aria-label when type is Main", async () => {
    const { Header, HeaderType } = await import("@/components/header/header");
    render(
      <Header type={HeaderType.Main}>
        <span>Content</span>
      </Header>
    );

    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("aria-label");
  });
});
