import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { lintBlog } from "../../scripts/lint";

const blogRoot = resolve(import.meta.dir, "../..");
const fixtureFile = "src/components/post-video/post-video.tsx";

function lint(source: string, entry?: string, filename = fixtureFile) {
  const result = spawnSync(process.execPath, ["run", "lint", "--", "--stdin", "--stdin-filename", filename], {
    cwd: blogRoot,
    encoding: "utf8",
    input: source,
    env: {
      ...process.env,
      TMPDIR: "/private/tmp",
      BUN_INSTALL_CACHE_DIR: "/private/tmp/bun-cache-blog-lint",
      ...(entry ? { BLOG_TAILWIND_ENTRY: entry } : {}),
    },
  });
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

describe("Blog lint command", () => {
  test("accepts theme, Typography, variants, and generated Shiki token utilities", () => {
    const result = lint(`export const Valid = () => <article className="prose prose-stone dark:prose-invert font-serif md:px-6 [&_code]:text-sm [&_[data-rehype-pretty-code-figure]_span]:text-[var(--shiki-light)]" />;`);
    expect(result.status).toBe(0);
    expect(result.output).toContain("Tailwind theme and shadcn/lint compiler verified");
    expect(result.output).not.toContain("using the grammar bundled");
  }, 20_000);

  test.each([
    ["unknown utility", "flex-cols", "shadcn/no-unknown-classes", "Did you mean"],
    ["unknown variant", "hovr:flex", "shadcn/no-unknown-classes", "Did you mean"],
    ["avoidable arbitrary value", "p-[13px]", "shadcn/no-arbitrary-values", "Use"],
  ])("reports %s", (_name, utility, rule, guidance) => {
    const result = lint(`export const Invalid = () => <div className="${utility}" />;`);
    expect(result.status).not.toBe(0);
    expect(result.output).toContain(rule);
    expect(result.output).toContain(guidance);
  }, 20_000);

  test("rejects authored inline presentation", () => {
    const result = lint("export const Invalid = () => <div style={{ color: 'red' }} />;");
    expect(result.status).not.toBe(0);
    expect(result.output).toContain("shadcn/no-inline-styles");
  }, 20_000);

  test("lints JSX in MDX posts with the supported theme vocabulary", () => {
    const filename = "content/posts/en/amsterdam-jsnation-2019/index.mdx";
    const valid = lint('# Heading\n\n<div className="prose font-serif dark:text-stone-50" />\n', undefined, filename);
    expect(valid.status).toBe(0);

    for (const [source, rule] of [
      ['# Heading\n\n<div className="flex-cols" />\n', "shadcn/no-unknown-classes"],
      ['# Heading\n\n<div className="p-[13px]" />\n', "shadcn/no-arbitrary-values"],
      ["# Heading\n\n<div style={{ color: 'red' }} />\n", "shadcn/no-inline-styles"],
    ]) {
      const invalid = lint(source, undefined, filename);
      expect(invalid.status).not.toBe(0);
      expect(invalid.output).toContain(rule);
    }
  }, 20_000);

  test("rejects a Tailwind entry without the class-based dark variant", () => {
    const directory = mkdtempSync(join(blogRoot, "src/app/.lint-dark-"));
    const entry = join(directory, "globals.css");
    try {
      const source = readFileSync(resolve(blogRoot, "src/app/globals.css"), "utf8");
      writeFileSync(entry, source.replace(/^@custom-variant dark .*\n/m, ""));
      const result = lint('export const Valid = () => <div className="font-serif" />;', entry);
      expect(result.status).not.toBe(0);
      expect(result.output).toContain("Blog Tailwind theme validation failed");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 20_000);

  test.each(["test/fixtures/missing-theme.css", "package.json"])("rejects an absent or unusable theme entry: %s", (entry) => {
    const result = lint("export const Valid = () => <div className=\"font-serif\" />;", entry);
    expect(result.status).not.toBe(0);
    expect(result.output).toContain("Blog Tailwind theme validation failed");
    expect(result.output).not.toContain("using the grammar bundled");
  });
});

test("lint wrapper fails closed on compiler, process, and shadcn fallback errors", async () => {
  const valid = 'export const Valid = () => <article className="prose font-serif" />;';
  const args = ["--stdin", "--stdin-filename", fixtureFile];
  expect(await lintBlog({ args, input: valid })).toBe(0);
  expect(await lintBlog({ args, input: 'export const Bad = () => <div className="flex-cols" />;' })).toBe(1);
  expect(await lintBlog({ entry: resolve(blogRoot, "package.json") })).toBe(1);
  expect(await lintBlog({ entry: resolve(blogRoot, "test/fixtures/missing-theme.css") })).toBe(1);
  expect(await lintBlog({ executable: "/no-such-eslint-executable" })).toBe(1);

  const directory = mkdtempSync(join(tmpdir(), "blog-lint-fallback-"));
  const executable = join(directory, "eslint");
  try {
    writeFileSync(executable, "#!/bin/sh\nprintf '[@shadcn/lint] Tailwind fallback\\n' >&2\n", { mode: 0o755 });
    expect(await lintBlog({ executable })).toBe(1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 20_000);
