import React from "react";
import Image, { ImageProps } from "next/image";

export interface MediaProps extends Omit<ImageProps, "alt"> {
  alt: string;
  aspectRatio?: "4/5" | "3/4" | "1/1" | "16/9" | "auto";
  caption?: string;
  isLcp?: boolean;
}

export function Media({
  src,
  alt,
  width,
  height,
  fill = false,
  aspectRatio = "4/5",
  isLcp = false,
  priority = false,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  caption,
  ...props
}: MediaProps) {
  const aspectClass = {
    "4/5": "aspect-[4/5]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "16/9": "aspect-video",
    auto: "",
  }[aspectRatio];

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width || 800 : undefined}
      height={!fill ? height || 1000 : undefined}
      fill={fill}
      priority={isLcp || priority}
      loading={isLcp || priority ? "eager" : "lazy"}
      fetchPriority={isLcp ? "high" : "auto"}
      sizes={sizes}
      className={`object-cover rounded-[var(--radius-media)] transition-opacity duration-300 ${
        fill ? "absolute inset-0 w-full h-full" : ""
      } ${className}`}
      {...props}
    />
  );

  if (fill || aspectRatio !== "auto") {
    const isFullContainer = fill && aspectRatio === "auto";
    return (
      <figure
        className={`relative overflow-hidden ${
          isFullContainer ? "w-full h-full" : `w-full ${aspectClass}`
        } rounded-[var(--radius-media)] bg-[var(--surface-subtle)]`}
      >
        {imageElement}
        {caption && (
          <figcaption className="sr-only">{caption}</figcaption>
        )}
      </figure>
    );
  }


  return (
    <figure className="relative overflow-hidden inline-block rounded-[var(--radius-media)] bg-[var(--surface-subtle)]">
      {imageElement}
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}

export default Media;
