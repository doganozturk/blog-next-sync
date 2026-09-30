import Link from "next/link";
import { ThemeSwitcher } from "~/components/theme-switcher/theme-switcher";

const HOME_ROUTE = "/en";

export enum HeaderType {
  Main = "main",
  Post = "post",
}

interface HeaderProps {
  readonly type: HeaderType;
  readonly children: React.ReactNode;
}

export function Header({ type, children }: HeaderProps) {
  return (
    <header className={`flex items-start justify-between gap-4 py-6 md:pt-12 md:pb-8${type === HeaderType.Post ? " motion-safe:animate-post-header" : ""}`}>
      <Link
        href={HOME_ROUTE}
        className="flex min-w-0 items-center gap-4 md:gap-6"
        aria-label={type === HeaderType.Post ? "back" : undefined}
      >
        {children}
      </Link>
      <ThemeSwitcher />
    </header>
  );
}
