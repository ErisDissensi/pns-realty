/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Sanity-hosted images
        pathname: '/**', // All paths on cdn.sanity.io
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google user images
        pathname: '/**', // All paths on Googleusercontent
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash images
        pathname: '/**', // All paths on Unsplash
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com', // Unsplash website images (if needed)
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com', // iStockPhoto images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.xx.fbcdn.net', // Facebook content images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com', // Facebook profile images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'web.facebook.com', // Additional Facebook images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com', // Facebook images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'panoraven.com', // Panoraven images
        pathname: '/**', // All paths on Panoraven
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '57023', // Add the port of your local server
        pathname: '/**',
      }
      
    ],
  },
};

export default nextConfig;
