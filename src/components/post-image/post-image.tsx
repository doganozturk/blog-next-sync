"use client";

import ExportedImage from "next-image-export-optimizer";

interface PostImageProps {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
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
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
    />
  );
}
