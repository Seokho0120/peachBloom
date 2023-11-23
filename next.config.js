/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    imageSizes: [100, 200, 300, 400, 500],
    deviceSizes: [580, 1024, 1284, 1400, 1600, 1800],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dn5hzapyfrpio.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
