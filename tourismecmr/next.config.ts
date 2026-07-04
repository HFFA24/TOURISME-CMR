/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.26.144.1", "localhost:3000"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
