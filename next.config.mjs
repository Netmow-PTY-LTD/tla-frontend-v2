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
      {
        protocol: 'https',
        hostname: 'files.thelawapp.com.au',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
