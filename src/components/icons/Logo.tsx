import Image from 'next/image';

interface LogoProps {
  height?: number; // in pixels
  className?: string; // Allow className for margins or other container styles
}

/**
 * Displays the Yunafa logo.
 * IMPORTANT: This component expects an image file named `logo.png` to be present in the `public` directory.
 */
export function Logo({ height = 30, className }: LogoProps) {
  // Estimated aspect ratio (width / height) of the core logo content from the provided image
  const aspectRatio = 2.25; 
  const width = Math.round(height * aspectRatio);

  return (
    <Image
      src="/logo.png" 
      alt="Yunafa Logo"
      width={width}
      height={height}
      className={className}
      priority // Good for LCP elements like a header logo
      aria-label="Yunafa Logo" // Keep accessibility
    />
  );
}
