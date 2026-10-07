import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const blogRoot = resolve(import.meta.dir, "../..");
const entry = resolve(blogRoot, "src/app/globals.css");

describe("Blog styling checks", () => {
  test("compiles the serif theme, Typography plugin, and class-based dark variant", async () => {
    const source = await Bun.file(entry).text();
    const { css } = await postcss([tailwind()]).process(source, { from: entry });

    expect(css).toContain(".font-serif");
    expect(css).toMatch(/--font-serif:\s*Georgia,\s*"Times New Roman",\s*serif/);
    expect(css).toContain(".prose");
    expect(css).toMatch(/\.dark\\:[^{\n]+:where\(\.dark,\s*\.dark \*\)/);
  });

  test("lints the full Blog without shadcn compiler fallback warnings", () => {
    const result = spawnSync(process.execPath, [
      "x", "--no-install", "eslint", ".",
    ], {
      cwd: blogRoot,
      encoding: "utf8",
    });

    expect(result.error).toBeUndefined();
    expect(`${result.stdout}\n${result.stderr}`).not.toContain("[@shadcn/lint]");
    expect(result.status).toBe(0);
  }, 20_000);
});
