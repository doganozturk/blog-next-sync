import type { Route } from "next";
import Link from "next/link";
import { ThemeSwitcher } from "~/components/theme-switcher/theme-switcher";
import styles from "./header.module.css";

export enum HeaderType {
  Main = "main",
  Post = "post",
}

interface HeaderProps {
  type: HeaderType;
  children: React.ReactNode;
}

export function Header({ type, children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link
        href={"/en/" as Route}
        className={styles.headerMain}
        aria-label={type === HeaderType.Post ? "back" : undefined}
      >
        {children}
      </Link>
      <ThemeSwitcher />
    </header>
  );
}
