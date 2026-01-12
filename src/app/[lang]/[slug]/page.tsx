import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostHeader } from "~/components/header/post-header/post-header";
import { Footer } from "~/components/footer/footer";
import { isLang } from "@data/posts/types";
import { getPostParams, getPostBySlug } from "@data/posts/server";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return getPostParams();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLang(lang)) {
    return {};
  }

  const post = getPostBySlug(slug, lang);

  if (!post) {
    return {};
  }

  const { title, description, permalink, date } = post.frontmatter;

  return {
    title,
    description,
    alternates: {
      canonical: `https://doganozturk.dev/${lang}/${slug}/`,
      languages: {
        en: `https://doganozturk.dev/en/${slug}/`,
        tr: `https://doganozturk.dev/tr/${slug}/`,
      },
    },
    twitter: {
      card: "summary",
      site: "Doğan Öztürk | Blog",
      creator: "Doğan Öztürk",
      title,
      description,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
    },
    openGraph: {
      title,
      type: "article",
      url: `https://doganozturk.dev${permalink}`,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
      description,
      siteName: "doganozturk.dev",
      publishedTime: date,
      authors: ["Doğan Öztürk"],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!isLang(lang)) {
    notFound();
  }

  let Content;
  try {
    const mdxModule = await import(`@content/posts/${lang}/${slug}/index.mdx`);
    Content = mdxModule.default;
  } catch {
    notFound();
  }

  return (
    <>
      <PostHeader />
      <main>
        <article className="post">
          <Content />
        </article>
      </main>
      <Footer />
    </>
  );
}
