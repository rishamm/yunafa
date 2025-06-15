
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Added to disable default image optimization
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
      { 
        protocol: 'https',
        hostname: 'your-bucket-name.mos.sufycloud.com',
        port: '',
        pathname: '/**',
      },
      { 
        protocol: 'https',
        hostname: '*.mos.sufycloud.com', 
        port: '',
        pathname: '/**',
      },
       { 
        protocol: 'https',
        hostname: '*.mos.ap-southeast-2.sufybkt.com', 
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_SUFY_PUBLIC_URL_PREFIX: process.env.SUFY_PUBLIC_URL_PREFIX || 'https://your-bucket-name.mos.sufycloud.com/',
  }
};

export default nextConfig;
