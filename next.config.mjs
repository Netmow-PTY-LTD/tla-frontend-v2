/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thelawapp.syd1.digitaloceanspaces.com',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
