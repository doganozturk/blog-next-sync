import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Lang, PostFrontmatter, PostData, PostParams } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

function getPostsDirectory(lang: Lang): string {
  return path.join(CONTENT_DIR, lang);
}

function parseFrontmatter(
  data: Record<string, unknown>,
  lang: Lang,
  slug: string
): PostFrontmatter {
  const title = data.title;
  const description = data.description;
  const date = data.date;
  const rawPermalink = data.permalink;

  if (typeof title !== "string" || !title) {
    throw new Error(`Missing or invalid title in ${lang}/${slug}`);
  }
  if (typeof description !== "string" || !description) {
    throw new Error(`Missing or invalid description in ${lang}/${slug}`);
  }
  if (typeof date !== "string" || !date) {
    throw new Error(`Missing or invalid date in ${lang}/${slug}`);
  }
  if (typeof rawPermalink !== "string" || !rawPermalink) {
    throw new Error(`Missing or invalid permalink in ${lang}/${slug}`);
  }

  const postSlug = rawPermalink.replace(/^\/?(tr\/)?/, "").replace(/\/$/, "");
  const permalink = `/${lang}/${postSlug}/`;

  return {
    title,
    description,
    date,
    permalink,
    lang,
  };
}

export function getAllPosts(lang?: Lang): PostFrontmatter[] {
  const languages: readonly Lang[] = lang ? [lang] : ["en", "tr"];
  const posts: PostFrontmatter[] = [];

  for (const language of languages) {
    const postsDir = getPostsDirectory(language);

    if (!fs.existsSync(postsDir)) {
      continue;
    }

    const slugs = fs.readdirSync(postsDir);

    for (const slug of slugs) {
      const postPath = path.join(postsDir, slug, "index.mdx");

      if (!fs.existsSync(postPath)) {
        continue;
      }

      const fileContents = fs.readFileSync(postPath, "utf8");
      const { data } = matter(fileContents);

      posts.push(parseFrontmatter(data, language, slug));
    }
  }

  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

export function getAllSlugs(lang: Lang): string[] {
  const postsDir = getPostsDirectory(lang);

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  return fs.readdirSync(postsDir).filter((slug) => {
    const postPath = path.join(postsDir, slug, "index.mdx");
    return fs.existsSync(postPath);
  });
}

export function getPostParams(): PostParams[] {
  const enSlugs = getAllSlugs("en").map((slug) => ({ lang: "en" as const, slug }));
  const trSlugs = getAllSlugs("tr").map((slug) => ({ lang: "tr" as const, slug }));
  return [...enSlugs, ...trSlugs];
}

export function getPostBySlug(slug: string, lang: Lang): PostData | null {
  const postsDir = getPostsDirectory(lang);
  const postPath = path.join(postsDir, slug, "index.mdx");

  if (!fs.existsSync(postPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: parseFrontmatter(data, lang, slug),
    slug,
    content,
  };
}

export function getPostByPermalink(permalink: string): PostData | null {
  const lang: Lang = permalink.startsWith("/tr/") ? "tr" : "en";
  const slug = permalink.replace(/^\/(en|tr)\//, "").replace(/\/$/, "");

  return getPostBySlug(slug, lang);
}
