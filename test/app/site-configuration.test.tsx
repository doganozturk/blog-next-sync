import { expect, test } from "bun:test";
import type { NextConfig } from "next";
import { useMDXComponents, formatDate, Locale } from "../../mdx-components";
import { PostImage } from "../../src/components/post-image/post-image";
import { PostVideo } from "../../src/components/post-video/post-video";

test("MDX content receives media components and can override them", () => {
  const customImage = () => null;
  const components = useMDXComponents({ PostImage: customImage });
  expect(components.PostImage).toBe(customImage);
  expect(components.PostVideo).toBe(PostVideo);
  expect(useMDXComponents({}).PostImage).toBe(PostImage);
  expect(formatDate("2025-01-10", Locale.en)).toBe("January 10, 2025");
});

test("static export and sitemap use compatible output and canonical site configuration", async () => {
  const { default: next } = await import(new URL("../../next.config.ts", import.meta.url).href) as { default: NextConfig };
  const { default: sitemap } = await import(new URL("../../next-sitemap.config.js", import.meta.url).href) as {
    default: { siteUrl: string; outDir: string; generateRobotsTxt: boolean };
  };
  expect(next.output).toBe("export");
  expect(next.pageExtensions).toContain("mdx");
  expect(next.images?.loader).toBe("custom");
  expect(next.env?.nextImageExportOptimizer_exportFolderPath).toBe(sitemap.outDir);
  expect(sitemap.siteUrl).toBe("https://doganozturk.dev");
  expect(sitemap.generateRobotsTxt).toBe(true);
});
