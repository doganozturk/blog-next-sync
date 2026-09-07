import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getAllPostUrls } from "../../scripts/generate-pagespeed-urls";

test("URL generation includes language roots and only existing post documents", () => {
  const root = mkdtempSync(join(tmpdir(), "blog-urls-"));
  try {
    expect(getAllPostUrls(root)).toEqual(["https://doganozturk.dev/en/", "https://doganozturk.dev/tr/"]);
    mkdirSync(join(root, "content/posts/en/post"), { recursive: true });
    mkdirSync(join(root, "content/posts/en/empty"));
    writeFileSync(join(root, "content/posts/en/post/index.mdx"), "# Post");
    expect(getAllPostUrls(root)).toEqual(["https://doganozturk.dev/en/", "https://doganozturk.dev/en/post/", "https://doganozturk.dev/tr/"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
