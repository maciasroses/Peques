/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ilidf54ifchqqkqe.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
