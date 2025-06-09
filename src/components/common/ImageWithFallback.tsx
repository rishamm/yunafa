
'use client';

import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { useState, useEffect, useCallback } from 'react';

// Pick props that are common and then add specific ones for width/height vs fill
type BaseProps = Omit<NextImageProps, 'src' | 'alt' | 'onError' | 'width' | 'height' | 'fill' | 'sizes' | 'priority'>;

interface ImageWithFallbackPropsShared extends BaseProps {
  initialSrc?: string | null;
  alt: string;
  className?: string;
  'data-ai-hint'?: string;
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
  ...props // Contains dimensional props (fill or width/height) and other NextImageProps like data-ai-hint
}: ImageWithFallbackProps) {
  
  const getPlaceholderUrl = useCallback(() => {
    if (props.fill) {
      return `https://placehold.co/600x400.png`;
    }
    // If not fill, props.width and props.height are guaranteed by types
    return `https://placehold.co/${props.width}x${props.height}.png`;
  }, [props.fill, (props as {width?: number}).width, (props as {height?: number}).height]); // useCallback dependencies
  
  const [currentSrc, setCurrentSrc] = useState(initialSrc?.trim() || getPlaceholderUrl());

  // Destructure specific props for the dependency array
  const { fill } = props;
  // Conditionally get width and height for dependency array
  const width = 'width' in props ? props.width : undefined;
  const height = 'height' in props ? props.height : undefined;

  useEffect(() => {
    setCurrentSrc(initialSrc?.trim() || getPlaceholderUrl());
  }, [initialSrc, fill, width, height, getPlaceholderUrl]);


  const handleError = () => {
    setCurrentSrc(getPlaceholderUrl());
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
        {...(props as Omit<typeof props, 'fill' | 'sizes' | 'priority' | 'width' | 'height'>)}
      />
    );
  } else {
    // props.width and props.height are numbers here
    return (
      <NextImage
        src={currentSrc}
        alt={alt}
        width={props.width}
        height={props.height}
        className={className}
        onError={handleError}
        {...(props as Omit<typeof props, 'fill' | 'sizes' | 'priority' | 'width' | 'height'>)}
      />
    );
  }
}

