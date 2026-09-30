import { Header, HeaderType } from "~/components/header/header";

export function PostHeader() {
  return (
    <Header type={HeaderType.Post}>
      <span className="group flex items-center gap-2 text-base font-medium tracking-wide text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500">
        <span className="inline-block motion-safe:transition-transform motion-safe:group-hover:-translate-x-1" aria-hidden="true">
          ←
        </span>
        {" "}
        doganozturk.dev
      </span>
    </Header>
  );
}
