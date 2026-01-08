import { Header, HeaderType } from "~/components/header/header";
import ExportedImage from "next-image-export-optimizer";
import styles from "./main-header.module.css";

export function MainHeader() {
  return (
    <Header type={HeaderType.Main}>
      <ExportedImage
        src="/images/avatar.jpg"
        alt="Doğan Öztürk"
        width={100}
        height={100}
        sizes="(max-width: 768px) 100px, 200px"
        priority
        className={styles.avatar}
      />
      <div className={styles.title}>
        <h1 className={styles.name}>Doğan Öztürk</h1>
        <p className={styles.info}>REFLECTIONS ON TECHNOLOGY, CULTURE, AND LIFE</p>
      </div>
    </Header>
  );
}
