#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://doganozturk.dev";
const LANGS = ["en", "tr"] as const;
type Lang = (typeof LANGS)[number];

function getPostsDirectory(contentDir: string, lang: Lang): string {
  return path.join(contentDir, lang);
}

function getPostUrls(contentDir: string, lang: Lang): string[] {
  const postsDir = getPostsDirectory(contentDir, lang);

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  return fs.readdirSync(postsDir).flatMap((slug) => {
    const postPath = path.join(postsDir, slug, "index.mdx");
    return fs.existsSync(postPath) ? [`${BASE_URL}/${lang}/${slug}/`] : [];
  });
}

export function getAllPostUrls(rootDir = process.cwd()): string[] {
  const contentDir = path.join(rootDir, "content/posts");
  return LANGS.flatMap((lang) => [
    `${BASE_URL}/${lang}/`,
    ...getPostUrls(contentDir, lang),
  ]).sort((left, right) => left.localeCompare(right));
}

if (import.meta.main) {
  for (const url of getAllPostUrls()) {
    console.log(url);
  }
}
