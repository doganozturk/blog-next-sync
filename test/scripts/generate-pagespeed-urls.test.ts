import { afterEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const fixtureDirectories: string[] = [];
const scriptPath = path.resolve(
  import.meta.dir,
  "../../scripts/generate-pagespeed-urls.ts"
);

afterEach(() => {
  for (const fixtureDirectory of fixtureDirectories.splice(0)) {
    fs.rmSync(fixtureDirectory, { recursive: true, force: true });
  }
});

describe("generate-pagespeed-urls command", () => {
  it("prints sorted home and post URLs while ignoring absent content", () => {
    const fixtureDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), "blog-pagespeed-urls-")
    );
    fixtureDirectories.push(fixtureDirectory);
    fs.mkdirSync(
      path.join(fixtureDirectory, "content/posts/en/kept-post"),
      { recursive: true }
    );
    fs.mkdirSync(
      path.join(fixtureDirectory, "content/posts/en/missing-index"),
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(fixtureDirectory, "content/posts/en/kept-post/index.mdx"),
      "# Kept post"
    );

    const result = Bun.spawnSync([process.execPath, "run", scriptPath], {
      cwd: fixtureDirectory,
      stdout: "pipe",
      stderr: "pipe",
    });

    expect(result.exitCode).toBe(0);
    expect(new TextDecoder().decode(result.stdout).trim().split("\n")).toEqual([
      "https://doganozturk.dev/en/",
      "https://doganozturk.dev/en/kept-post/",
      "https://doganozturk.dev/tr/",
    ]);
  });
});
