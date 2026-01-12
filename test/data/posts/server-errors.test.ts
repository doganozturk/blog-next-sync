import { describe, expect, it, spyOn, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "@data/posts/server";

describe("parseFrontmatter error cases", () => {
  const CONTENT_DIR = path.join(process.cwd(), "content/posts");

  // Spy references
  let existsSyncSpy: ReturnType<typeof spyOn>;
  let readdirSyncSpy: ReturnType<typeof spyOn>;
  let readFileSyncSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    existsSyncSpy = spyOn(fs, "existsSync");
    readdirSyncSpy = spyOn(fs, "readdirSync");
    readFileSyncSpy = spyOn(fs, "readFileSync");
  });

  afterEach(() => {
    existsSyncSpy.mockRestore();
    readdirSyncSpy.mockRestore();
    readFileSyncSpy.mockRestore();
  });

  it("throws error when title is missing", () => {
    const invalidContent = `---
description: "Test description"
permalink: "/test/"
date: "2025-01-01"
lang: "en"
---
Content`;

    existsSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return true;
      if (p === path.join(CONTENT_DIR, "en", "invalid-post", "index.mdx"))
        return true;
      return false;
    });

    readdirSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return ["invalid-post"];
      return [];
    });

    readFileSyncSpy.mockImplementation(() => invalidContent);

    expect(() => getAllPosts("en")).toThrow("Missing or invalid title");
  });

  it("throws error when description is missing", () => {
    const invalidContent = `---
title: "Test Title"
permalink: "/test/"
date: "2025-01-01"
lang: "en"
---
Content`;

    existsSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return true;
      if (p === path.join(CONTENT_DIR, "en", "invalid-post", "index.mdx"))
        return true;
      return false;
    });

    readdirSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return ["invalid-post"];
      return [];
    });

    readFileSyncSpy.mockImplementation(() => invalidContent);

    expect(() => getAllPosts("en")).toThrow("Missing or invalid description");
  });

  it("throws error when date is missing", () => {
    const invalidContent = `---
title: "Test Title"
description: "Test description"
permalink: "/test/"
lang: "en"
---
Content`;

    existsSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return true;
      if (p === path.join(CONTENT_DIR, "en", "invalid-post", "index.mdx"))
        return true;
      return false;
    });

    readdirSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return ["invalid-post"];
      return [];
    });

    readFileSyncSpy.mockImplementation(() => invalidContent);

    expect(() => getAllPosts("en")).toThrow("Missing or invalid date");
  });

  it("throws error when permalink is missing", () => {
    const invalidContent = `---
title: "Test Title"
description: "Test description"
date: "2025-01-01"
lang: "en"
---
Content`;

    existsSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return true;
      if (p === path.join(CONTENT_DIR, "en", "invalid-post", "index.mdx"))
        return true;
      return false;
    });

    readdirSyncSpy.mockImplementation((p: string) => {
      if (p === path.join(CONTENT_DIR, "en")) return ["invalid-post"];
      return [];
    });

    readFileSyncSpy.mockImplementation(() => invalidContent);

    expect(() => getAllPosts("en")).toThrow("Missing or invalid permalink");
  });
});
