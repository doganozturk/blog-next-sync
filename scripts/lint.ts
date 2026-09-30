import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const blogRoot = resolve(import.meta.dir, "..");
const eslintExecutable = resolve(dirname(dirname(createRequire(import.meta.url).resolve("eslint"))), "bin/eslint.js");

export async function lintBlog({
  entry = resolve(blogRoot, process.env.BLOG_TAILWIND_ENTRY ?? "src/app/globals.css"),
  args = [],
  input,
  executable = eslintExecutable,
}: {
  entry?: string;
  args?: string[];
  input?: string;
  executable?: string;
} = {}): Promise<number> {
  try {
    const source = await Bun.file(entry).text();
    const result = await postcss([tailwind()]).process(source, { from: entry });
    const css = result.css;

    const classBasedDarkVariant = /\.dark\\:[^{\n]+:where\(\.dark,\s*\.dark \*\)/.test(css);
    if (!css.includes(".font-serif") || !css.includes("Georgia") || !css.includes(".prose") || !classBasedDarkVariant) {
      throw new Error("Tailwind did not compile the Blog serif theme, Typography plugin, and dark variant");
    }

    const lint = spawnSync(executable, [".", ...args], {
      cwd: blogRoot,
      encoding: "utf8",
      input: input ?? (args.includes("--stdin") ? readFileSync(0) : undefined),
    });
    process.stdout.write(lint.stdout ?? "");
    process.stderr.write(lint.stderr ?? "");

    if (lint.error) throw lint.error;
    if ((lint.stderr ?? "").includes("[@shadcn/lint]")) {
      throw new Error("shadcn/lint reported a configuration or Tailwind compiler fallback warning");
    }
    if (lint.status !== 0) return lint.status ?? 1;

    console.log(`Tailwind theme and shadcn/lint compiler verified from ${entry}`);
    return 0;
  } catch (error) {
    console.error(`Blog Tailwind theme validation failed: ${String(error)}`);
    return 1;
  }
}

if (import.meta.main) {
  process.exitCode = await lintBlog({ args: process.argv.slice(2).filter((arg) => arg !== "--") });
}
