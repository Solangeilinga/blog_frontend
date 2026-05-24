import type { MetadataRoute } from "next";
import { BASE_URL as API_URL } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Pages statiques toujours présentes
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url:              SITE_URL,
    lastModified:     new Date(),
    changeFrequency:  "daily",
    priority:         1,
  },
  {
    url:              `${SITE_URL}/a-propos`,
    lastModified:     new Date(),
    changeFrequency:  "monthly",
    priority:         0.5,
  },
  {
    url:              `${SITE_URL}/contact`,
    lastModified:     new Date(),
    changeFrequency:  "yearly",
    priority:         0.4,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Articles publiés
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const res  = await fetch(`${API_URL}/articles?statut=publie&limit=200`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const { data } = await res.json();
      articleRoutes = data.map((article: { id: number; date_creation: string }) => ({
        url:             `${SITE_URL}/article/${article.id}`,
        lastModified:    new Date(article.date_creation),
        changeFrequency: "weekly" as const,
        priority:        0.8,
      }));
    }
  } catch {
    // En cas d'erreur réseau, le sitemap reste partiel — pas bloquant
  }

  // Catégories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 86400 } });
    if (res.ok) {
      const categories = await res.json();
      categoryRoutes = categories.map((cat: { slug: string | null; name: string }) => {
        const slug = cat.slug ?? cat.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        return {
          url:             `${SITE_URL}/${slug}`,
          lastModified:    new Date(),
          changeFrequency: "weekly" as const,
          priority:        0.6,
        };
      });
    }
  } catch {
    // idem
  }

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}