
'use client';

import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { useState, useEffect } from 'react';

// Pick props that are common and then add specific ones for width/height vs fill
type BaseProps = Omit<NextImageProps, 'src' | 'alt' | 'onError' | 'width' | 'height' | 'fill' | 'sizes' | 'priority'>;

interface ImageWithFallbackPropsShared extends BaseProps {
  initialSrc?: string | null;
  alt: string;
  className?: string;
}

// Discriminated union for width/height vs fill
type ImageWithFallbackProps = ImageWithFallbackPropsShared & (
  | { fill: true; width?: never; height?: never; sizes?: string; priority?: boolean; }
  | { fill?: false; width: number; height: number; sizes?: never; priority?: never; }
);

export function ImageWithFallback({
  initialSrc,
  alt,
  className,
  ...props
}: ImageWithFallbackProps) {
  
  let placeholderUrl: string;
  if (props.fill) {
    placeholderUrl = `https://placehold.co/600x400.png`; // Generic placeholder for fill
  } else {
    // props.width and props.height are guaranteed to be numbers here by TypeScript
    placeholderUrl = `https://placehold.co/${props.width}x${props.height}.png`;
  }

  const [currentSrc, setCurrentSrc] = useState(initialSrc?.trim() || placeholderUrl);

  useEffect(() => {
    let newPlaceholderUrl: string;
    if (props.fill) {
        newPlaceholderUrl = `https://placehold.co/600x400.png`;
    } else {
        newPlaceholderUrl = `https://placehold.co/${(props as {width: number}).width}x${(props as {height: number}).height}.png`;
    }
    setCurrentSrc(initialSrc?.trim() || newPlaceholderUrl);
  }, [initialSrc, props]);

  const handleError = () => {
    let errorFallbackUrl: string;
    if (props.fill) {
        errorFallbackUrl = `https://placehold.co/600x400.png`;
    } else {
        errorFallbackUrl = `https://placehold.co/${(props as {width: number}).width}x${(props as {height: number}).height}.png`;
    }
    setCurrentSrc(errorFallbackUrl);
  };

  if (props.fill) {
    return (
      <NextImage
        src={currentSrc}
        alt={alt}
        fill
        sizes={props.sizes}
        priority={props.priority}
        className={className}
        onError={handleError}
        {...(props as Omit<typeof props, 'fill' | 'sizes' | 'priority'>)}
      />
    );
  } else {
    return (
      <NextImage
        src={currentSrc}
        alt={alt}
        width={props.width}
        height={props.height}
        className={className}
        onError={handleError}
        {...(props as Omit<typeof props, 'width' | 'height'>)}
      />
    );
  }
}
