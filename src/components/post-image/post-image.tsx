"use client";

import ExportedImage from "next-image-export-optimizer";
import styles from "./post-image.module.css";

interface PostImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export function PostImage({
  src,
  alt,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: PostImageProps) {
  return (
    <ExportedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={styles.postImage}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
    />
  );
}
