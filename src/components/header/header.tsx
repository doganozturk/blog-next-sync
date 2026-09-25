import Link from "next/link";
import { ThemeSwitcher } from "~/components/theme-switcher/theme-switcher";
import styles from "./header.module.css";

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
    <header className={styles.header}>
      <Link
        href={HOME_ROUTE}
        className={styles.headerMain}
        aria-label={type === HeaderType.Post ? "back" : undefined}
      >
        {children}
      </Link>
      <ThemeSwitcher />
    </header>
  );
}
