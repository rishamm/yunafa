
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
    const basePortraitUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b"; // shopping bags
    const baseLandscapeUrl = "https://images.unsplash.com/photo-1472851294608-062f824d29cc"; // storefront

    if (props.fill) {
      // Default to landscape for fill, common aspect ratio for general placeholders
      return `${baseLandscapeUrl}?w=600&h=400&fit=crop&q=60`;
    }
    // If not fill, props.width and props.height are guaranteed by types
    const w = (props as {width: number}).width;
    const h = (props as {height: number}).height;
    if (h > w) { // Portrait
      return `${basePortraitUrl}?w=${w}&h=${h}&fit=crop&q=60`;
    } else { // Landscape or square
      return `${baseLandscapeUrl}?w=${w}&h=${h}&fit=crop&q=60`;
    }
  }, [props.fill, (props as {width?: number}).width, (props as {height?: number}).height]);
  
  const [currentSrc, setCurrentSrc] = useState(initialSrc?.trim() || getPlaceholderUrl());
  const [currentHint, setCurrentHint] = useState(props['data-ai-hint'] || (initialSrc?.trim() ? alt.substring(0,20) : "placeholder image"));


  // Destructure specific props for the dependency array
  const { fill } = props;
  // Conditionally get width and height for dependency array
  const width = 'width' in props ? props.width : undefined;
  const height = 'height' in props ? props.height : undefined;

  useEffect(() => {
    const newSrc = initialSrc?.trim() || getPlaceholderUrl();
    setCurrentSrc(newSrc);
    if (!initialSrc?.trim()) {
        // Determine hint based on aspect ratio if using placeholder
        let placeholderHint = "placeholder image";
        if (!fill && width && height) {
            placeholderHint = height > width ? "fashion abstract" : "store abstract";
        } else if (fill) {
            placeholderHint = "abstract background"; // generic for fill
        }
        setCurrentHint(placeholderHint);
    } else {
        setCurrentHint(props['data-ai-hint'] || alt.substring(0,20));
    }
  }, [initialSrc, fill, width, height, getPlaceholderUrl, props['data-ai-hint'], alt]);


  const handleError = () => {
    setCurrentSrc(getPlaceholderUrl());
    // Determine hint based on aspect ratio when error occurs
    let placeholderHint = "placeholder image";
    if (!fill && width && height) {
        placeholderHint = height > width ? "fashion abstract" : "store abstract";
    } else if (fill) {
        placeholderHint = "abstract background";
    }
    setCurrentHint(placeholderHint);
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
        data-ai-hint={currentHint}
        {...(props as Omit<typeof props, 'fill' | 'sizes' | 'priority' | 'width' | 'height' | 'data-ai-hint'>)}
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
        data-ai-hint={currentHint}
        {...(props as Omit<typeof props, 'fill' | 'sizes' | 'priority' | 'width' | 'height' | 'data-ai-hint'>)}
      />
    );
  }
}
