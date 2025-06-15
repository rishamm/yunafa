
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
      { // For Sufy: Matches the hostname structure from the SUFY_PUBLIC_URL_PREFIX placeholder.
        // Example: if SUFY_PUBLIC_URL_PREFIX is "https://your-bucket-name.mos.sufycloud.com/",
        // then the hostname is "your-bucket-name.mos.sufycloud.com".
        // Please adjust this if your Sufy URL structure is different.
        protocol: 'https',
        hostname: 'your-bucket-name.mos.sufycloud.com',
        port: '',
        pathname: '/**',
      },
      { // A more general pattern if your bucket names are subdomains of a primary Sufy domain like mos.sufycloud.com
        protocol: 'https',
        hostname: '*.mos.sufycloud.com', // Allows any subdomain of mos.sufycloud.com
        port: '',
        pathname: '/**',
      },
       { // A general pattern if your bucket names are subdomains of a primary Sufy domain like sufybkt.com for ap-southeast-2
        protocol: 'https',
        hostname: '*.mos.ap-southeast-2.sufybkt.com', // Allows any subdomain of mos.ap-southeast-2.sufybkt.com
        port: '',
        pathname: '/**',
      }
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
