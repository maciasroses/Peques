/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pequesbucket.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
