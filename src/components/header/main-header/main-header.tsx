import { Header, HeaderType } from "~/components/header/header";
import ExportedImage from "next-image-export-optimizer";

export function MainHeader() {
  return (
    <Header type={HeaderType.Main}>
      <ExportedImage
        src="/images/avatar.jpg"
        alt="Doğan Öztürk"
        width={100}
        height={100}
        sizes="(max-width: 768px) 100px, 200px"
        loading="eager"
        className="size-16 shrink-0 rounded-full border-3 border-stone-200 dark:border-stone-800 md:size-25 motion-safe:transition hover:border-orange-600"
      />
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="font-serif text-3xl font-normal leading-tight tracking-tight md:text-4xl">Doğan Öztürk</h1>
        <p className="text-sm leading-snug text-stone-600 uppercase dark:text-stone-400 md:tracking-wide">
          REFLECTIONS ON TECHNOLOGY,{" "}
          <span className="max-md:portrait:block">CULTURE, AND LIFE</span>
        </p>
      </div>
    </Header>
  );
}
