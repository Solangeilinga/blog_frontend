import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV !== "production" && {
    experimental: { turbo: {} },
  }),

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http",  hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "*.onrender.com", pathname: "/uploads/**" },
    ],
  },

  async redirects() {
    return [
      // ── Anciennes URLs en majuscule (dossiers renommés) ────────────────────
      // CORRIGÉ : /Contact et /NewArticle redirigent vers les nouvelles URLs lowercase
      { source: "/Contact",    destination: "/contact",         permanent: true },
      { source: "/NewArticle", destination: "/nouvel-article",  permanent: true },

      // ── Ancienne URL sans tiret ────────────────────────────────────────────
      // CORRIGÉ : /apropos redirige vers /a-propos
      { source: "/apropos",    destination: "/a-propos",        permanent: true },

      // ── Autres anciennes URLs (catégories) ────────────────────────────────
      { source: "/Orientation",       destination: "/education",       permanent: true },
      { source: "/Education",         destination: "/education",       permanent: true },
      { source: "/Carriere",          destination: "/carriere",        permanent: true },
      { source: "/Opportunites",      destination: "/opportunites",    permanent: true },
      { source: "/Competences",       destination: "/technologie",     permanent: true },
      { source: "/Technologie",       destination: "/technologie",     permanent: true },
      { source: "/DeveloppementPerso",destination: "/societe",         permanent: true },
      { source: "/Societe",           destination: "/societe",         permanent: true },
      { source: "/Entrepreneuriat",   destination: "/entrepreneuriat", permanent: true },

      // SUPPRIMÉ : { source: "/dashboard", destination: "/dashboard" } → boucle inutile
    ];
  },

  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: blob: res.cloudinary.com images.unsplash.com i.pravatar.cc ${apiUrl} *.onrender.com`,
              "font-src 'self'",
              `connect-src 'self' ${apiUrl}`,
              "frame-src 'none'",
              "object-src 'none'",
              "form-action 'self'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;