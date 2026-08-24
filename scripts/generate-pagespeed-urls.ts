#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://doganozturk.dev";
const LANGS = ["en", "tr"] as const;
type Lang = (typeof LANGS)[number];

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

function getPostsDirectory(lang: Lang): string {
  return path.join(CONTENT_DIR, lang);
}

function getAllPostUrls(): string[] {
  const urls: string[] = [];

  for (const lang of LANGS) {
    urls.push(`${BASE_URL}/${lang}/`);
  }

  for (const lang of LANGS) {
    const postsDir = getPostsDirectory(lang);

    if (!fs.existsSync(postsDir)) {
      continue;
    }

    const slugs = fs.readdirSync(postsDir);

    for (const slug of slugs) {
      const postPath = path.join(postsDir, slug, "index.mdx");

      if (!fs.existsSync(postPath)) {
        continue;
      }

      urls.push(`${BASE_URL}/${lang}/${slug}/`);
    }
  }

  return urls.sort((a, b) => a.localeCompare(b));
}

const urls = getAllPostUrls();
for (const url of urls) {
  console.log(url);
}
