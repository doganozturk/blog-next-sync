import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "~/app/globals.css";

type Props = {
  readonly children: React.ReactNode;
  readonly params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "tr" }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning className="antialiased">
      <body suppressHydrationWarning className="transition-colors duration-300 ease-in-out motion-reduce:transition-none bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="flex min-h-dvh w-full justify-center font-sans text-base leading-relaxed [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-orange-600 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-orange-600">
            <div className="flex w-full max-w-2xl max-md:has-[article]:max-w-none min-w-0 flex-col px-4 md:px-6">{children}</div>
          </div>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
