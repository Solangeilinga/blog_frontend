import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http",  hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "*.onrender.com", pathname: "/uploads/**" },
    ],
  },
  // Redirections des anciennes URLs majuscules vers minuscules
  async redirects() {
    return [
      { source: "/Orientation",        destination: "/education",       permanent: true },
      { source: "/Education",           destination: "/education",       permanent: true },
      { source: "/Carriere",            destination: "/carriere",        permanent: true },
      { source: "/Opportunites",        destination: "/opportunites",    permanent: true },
      { source: "/Competences",         destination: "/technologie",     permanent: true },
      { source: "/Technologie",         destination: "/technologie",     permanent: true },
      { source: "/DeveloppementPerso",  destination: "/societe",         permanent: true },
      { source: "/Societe",             destination: "/societe",         permanent: true },
      { source: "/Entrepreneuriat",     destination: "/entrepreneuriat", permanent: true },
      { source: "/Contact",             destination: "/contact",         permanent: true },
      { source: "/NewArticle",          destination: "/nouvel-article",  permanent: true },
      { source: "/dashboard",           destination: "/dashboard",       permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",         value: "DENY" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;