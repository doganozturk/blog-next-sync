"use client";

import { useState, useCallback } from "react";

interface PostVideoProps {
  readonly id: string;
  readonly title: string;
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
      <div className="relative my-8 aspect-video w-full overflow-hidden bg-black md:rounded-lg">
        <iframe
          width="560"
          height="315"
          title={title}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative my-8 aspect-video w-full overflow-hidden bg-black md:rounded-lg">
      <button
        type="button"
        className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-600"
        onClick={handleClick}
        aria-label={`Play video: ${title}`}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 m-0! h-full! w-full! max-w-full! rounded-none! object-cover"
          loading="lazy"
        />
        <span className="relative z-10 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110" aria-hidden="true">
          <svg viewBox="0 0 68 48" width="68" height="48">
            <path
              className="fill-neutral-900/80 group-hover:fill-red-600 group-focus-visible:fill-red-600"
              d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
            />
            <path className="fill-white" d="M45 24 27 14v20" />
          </svg>
        </span>
      </button>
    </div>
  );
}
