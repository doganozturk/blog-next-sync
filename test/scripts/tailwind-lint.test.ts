import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const blogRoot = resolve(import.meta.dir, "../..");
const fixtureFile = "src/components/post-video/post-video.tsx";

function lint(source: string, filename = fixtureFile) {
  const result = spawnSync(process.execPath, ["x", "--no-install", "eslint", ".", "--stdin", "--stdin-filename", filename], {
    cwd: blogRoot,
    encoding: "utf8",
    input: source,
    env: {
      ...process.env,
      TMPDIR: "/private/tmp",
      BUN_INSTALL_CACHE_DIR: "/private/tmp/bun-cache-blog-lint",
    },
  });
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

describe("Blog authoring rules", () => {
  test("accepts theme, Typography, variants, and generated Shiki token utilities", () => {
    const result = lint(`export const Valid = () => <article className="prose prose-stone dark:prose-invert font-serif md:px-6 [&_code]:text-sm [&_[data-rehype-pretty-code-figure]_span]:text-[var(--shiki-light)]" />;`);
    expect(result.status).toBe(0);
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
    const valid = lint('# Heading\n\n<div className="prose font-serif dark:text-stone-50" />\n', filename);
    expect(valid.status).toBe(0);

    for (const [source, rule] of [
      ['# Heading\n\n<div className="flex-cols" />\n', "shadcn/no-unknown-classes"],
      ['# Heading\n\n<div className="p-[13px]" />\n', "shadcn/no-arbitrary-values"],
      ["# Heading\n\n<div style={{ color: 'red' }} />\n", "shadcn/no-inline-styles"],
    ]) {
      const invalid = lint(source, filename);
      expect(invalid.status).not.toBe(0);
      expect(invalid.output).toContain(rule);
    }
  }, 20_000);

});
