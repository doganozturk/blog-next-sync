import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainHeader } from "~/components/header/main-header/main-header";
import { Footer } from "~/components/footer/footer";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";
import { isLang } from "@data/posts/types";
import { getAllPosts } from "@data/posts/server";

type Props = {
  params: Promise<{ lang: string }>;
};

const META = {
  en: {
    title: "Doğan Öztürk | Blog",
    description:
      "I'm Doğan, a software engineer passionate about front-end development, JavaScript and Node.js. On my blog, I share my expertise and experiences in tech, as well as my interests in role-playing games, computer games, sci-fi and more.",
    url: "https://doganozturk.dev/en/",
  },
  tr: {
    title: "Doğan Öztürk | Blog",
    description:
      "Ben Doğan, front-end geliştirme, JavaScript ve Node.js tutkusu olan bir yazılım mühendisiyim. Blogumda teknoloji alanındaki uzmanlığımı ve deneyimlerimi, ayrıca rol yapma oyunları, bilgisayar oyunları, bilim kurgu ve daha fazlasına olan ilgimi paylaşıyorum.",
    url: "https://doganozturk.dev/tr/",
  },
} as const;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "tr" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  if (!isLang(lang)) {
    return {};
  }

  const { title, description, url } = META[lang];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: "https://doganozturk.dev/en/",
        tr: "https://doganozturk.dev/tr/",
      },
    },
    twitter: {
      card: "summary",
      site: title,
      creator: "Doğan Öztürk",
      title,
      description,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
    },
    openGraph: {
      title,
      type: "article",
      url,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
      description,
      siteName: "doganozturk.dev",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  if (!isLang(lang)) {
    notFound();
  }

  const posts = getAllPosts(lang);

  return (
    <>
      <MainHeader />
      <main className="main">
        <PostSummaryList data={posts} />
      </main>
      <Footer />
    </>
  );
}
