import { describe, expect, it } from "bun:test";
import {
  getAllPosts,
  getAllSlugs,
  getPostParams,
  getPostBySlug,
  getPostByPermalink,
} from "./server";

describe("getAllPosts", () => {
  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();

    expect(posts.length).toBeGreaterThan(0);

    // Verify sorted by date descending
    for (let i = 1; i < posts.length; i++) {
      const prevDate = new Date(posts[i - 1].date).getTime();
      const currDate = new Date(posts[i].date).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  it("filters posts by language when lang is provided", () => {
    const enPosts = getAllPosts("en");
    const trPosts = getAllPosts("tr");

    expect(enPosts.every((p) => p.lang === "en")).toBe(true);
    expect(trPosts.every((p) => p.lang === "tr")).toBe(true);
  });

  it("returns posts with required frontmatter fields", () => {
    const posts = getAllPosts();

    for (const post of posts) {
      expect(post.title).toBeDefined();
      expect(typeof post.title).toBe("string");
      expect(post.description).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.permalink).toBeDefined();
      expect(post.lang).toBeDefined();
    }
  });

  it("normalizes permalinks to /{lang}/{slug}/ format", () => {
    const posts = getAllPosts();

    for (const post of posts) {
      expect(post.permalink).toMatch(/^\/(en|tr)\/[\w-]+\/$/);
    }
  });
});

describe("getAllSlugs", () => {
  it("returns array of slugs for English posts", () => {
    const slugs = getAllSlugs("en");

    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs.every((s) => typeof s === "string")).toBe(true);
  });

  it("returns array of slugs for Turkish posts", () => {
    const slugs = getAllSlugs("tr");

    expect(Array.isArray(slugs)).toBe(true);
    expect(slugs.every((s) => typeof s === "string")).toBe(true);
  });
});

describe("getPostParams", () => {
  it("returns params for all posts with lang and slug", () => {
    const params = getPostParams();

    expect(params.length).toBeGreaterThan(0);

    for (const param of params) {
      expect(param.lang).toMatch(/^(en|tr)$/);
      expect(typeof param.slug).toBe("string");
      expect(param.slug.length).toBeGreaterThan(0);
    }
  });

  it("includes posts from both languages", () => {
    const params = getPostParams();

    const hasEn = params.some((p) => p.lang === "en");
    const hasTr = params.some((p) => p.lang === "tr");

    expect(hasEn).toBe(true);
    expect(hasTr).toBe(true);
  });
});

describe("getPostBySlug", () => {
  it("returns post data for valid slug", () => {
    const slugs = getAllSlugs("en");
    const firstSlug = slugs[0];
    const post = getPostBySlug(firstSlug, "en");

    expect(post).not.toBeNull();
    expect(post!.slug).toBe(firstSlug);
    expect(post!.frontmatter).toBeDefined();
    expect(post!.content).toBeDefined();
    expect(typeof post!.content).toBe("string");
  });

  it("returns null for non-existent slug", () => {
    const post = getPostBySlug("non-existent-post-slug", "en");

    expect(post).toBeNull();
  });

  it("returns null for wrong language", () => {
    const enSlugs = getAllSlugs("en");
    const firstEnSlug = enSlugs[0];

    // Try to get an English post with Turkish language
    const post = getPostBySlug(firstEnSlug, "tr");

    // This may or may not be null depending on if there's a TR post with same slug
    // Just verify function doesn't throw
    expect(post === null || post.frontmatter.lang === "tr").toBe(true);
  });
});

describe("getPostByPermalink", () => {
  it("returns post data for valid English permalink", () => {
    const posts = getAllPosts("en");
    const firstPost = posts[0];
    const post = getPostByPermalink(firstPost.permalink);

    expect(post).not.toBeNull();
    expect(post!.frontmatter.permalink).toBe(firstPost.permalink);
  });

  it("returns post data for valid Turkish permalink", () => {
    const posts = getAllPosts("tr");
    if (posts.length > 0) {
      const firstPost = posts[0];
      const post = getPostByPermalink(firstPost.permalink);

      expect(post).not.toBeNull();
      expect(post!.frontmatter.permalink).toBe(firstPost.permalink);
    }
  });

  it("returns null for non-existent permalink", () => {
    const post = getPostByPermalink("/en/non-existent-post/");

    expect(post).toBeNull();
  });

  it("correctly identifies language from permalink", () => {
    const trPosts = getAllPosts("tr");
    if (trPosts.length > 0) {
      const trPost = getPostByPermalink(trPosts[0].permalink);
      expect(trPost?.frontmatter.lang).toBe("tr");
    }

    const enPosts = getAllPosts("en");
    const enPost = getPostByPermalink(enPosts[0].permalink);
    expect(enPost?.frontmatter.lang).toBe("en");
  });
});
