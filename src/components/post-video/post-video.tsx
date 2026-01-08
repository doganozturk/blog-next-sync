"use client";

import { useState, useCallback } from "react";
import styles from "./post-video.module.css";

interface PostVideoProps {
  id: string;
  title: string;
}

export function PostVideo({ id, title }: PostVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;

  if (isLoaded) {
    return (
      <div className={styles.postVideo}>
        <iframe
          width="560"
          height="315"
          title={title}
          src={embedUrl}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={styles.postVideo}>
      <button
        type="button"
        className={styles.thumbnail}
        onClick={handleClick}
        aria-label={`Play video: ${title}`}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className={styles.thumbnailImage}
          loading="lazy"
        />
        <span className={styles.playButton} aria-hidden="true">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path
              className={styles.playButtonBg}
              d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
            />
            <path className={styles.playButtonIcon} d="M45 24 27 14v20" />
          </svg>
        </span>
      </button>
    </div>
  );
}
