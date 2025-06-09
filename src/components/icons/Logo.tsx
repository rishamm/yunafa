import Image from 'next/image';

interface LogoProps {
  height?: number; // in pixels
  className?: string; // Allow className for margins or other container styles
}

/**
 * Displays the Yunafa logo.
 * IMPORTANT: This component expects an image file named `logo.jpg` to be present in the `public` directory.
 */
export function Logo({ height = 150, className }: LogoProps) {
  // Estimated aspect ratio (width / height) of the core logo content from the provided image
  const aspectRatio = 2.75; // Increased from 2.5
  const width = Math.round(height * aspectRatio);

  return (
    <Image
      src="/logo2.png" // Changed from logo.png back to logo.jpg as per user's file content
      alt="Yunafa Logo"
      width={width}
      height={height}
      className={className}
      priority // Good for LCP elements like a header logo
      aria-label="Yunafa Logo" // Keep accessibility
    />
  );
}
