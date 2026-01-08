import { Header, HeaderType } from "~/components/header/header";
import styles from "./post-header.module.css";

export function PostHeader() {
  return (
    <Header type={HeaderType.Post}>
      <span className={styles.backLink}>
        <span className={styles.backArrow} aria-hidden="true">
          ←
        </span>
        doganozturk.dev
      </span>
    </Header>
  );
}
