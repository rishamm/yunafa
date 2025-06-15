
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zoric.studio',
        port: '',
        pathname: '/**',
      },
      { // For Sufy CDN - adjust hostname if your bucket/CDN URL is different
        protocol: 'https',
        hostname: 'mos.sufycloud.com', // Default based on endpoint. Replace if your files are served from a different (sub)domain.
        port: '',
        pathname: '/**', // Or a more specific path like '/your-bucket-name/**'
      },
      // If you have a custom CDN domain for Sufy, add it here too.
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.yourdomain.com',
      //   port: '',
      //   pathname: '/**',
      // }
    ],
  },
  env: {
    // Expose public URL prefix to the client-side if needed by components
    // Note: Only NEXT_PUBLIC_ variables are exposed to the browser.
    // The /api/upload route will use process.env directly.
    // This is useful if CarouselItemForm or other client components need to construct default URLs.
    NEXT_PUBLIC_SUFY_PUBLIC_URL_PREFIX: process.env.SUFY_PUBLIC_URL_PREFIX || 'https://your-bucket-name.mos.sufycloud.com/',
  }
};

export default nextConfig;
