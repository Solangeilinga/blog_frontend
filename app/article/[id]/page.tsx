import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Sidebar         from "@/components/Sidebar";
import ArticleHero     from "@/components/ArticleHero";
import ArticleMeta     from "@/components/ArticleMeta";
import ArticleContent  from "@/components/ArticleContent";
import SimilarArticles from "@/components/SimilarArticles";
import ArticleInteractions from "@/components/ArticleInteractions";
import { type ApiArticle, type ApiComment } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getArticle(id: string): Promise<ApiArticle | null> {
  const res = await fetch(`${BASE}/articles/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

async function getSimilar(id: string) {
  const res = await fetch(`${BASE}/articles/${id}/related`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

async function getComments(id: string): Promise<ApiComment[]> {
  const res = await fetch(`${BASE}/comments/article/${id}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// ── SEO dynamique par article ────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id }  = await params;
  const article = await getArticle(id);
  if (!article) return { title: "Article introuvable — EduBlog" };

  const description = article.contenu.slice(0, 155).replace(/\s+/g, " ").trim();

  return {
    title:       `${article.titre} — EduBlog`,
    description,
    openGraph: {
      title:       article.titre,
      description,
      type:        "article",
      publishedTime: article.date_creation,
      images: article.image ? [{ url: article.image }] : [],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ArticlePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [article, similar, comments] = await Promise.all([
    getArticle(id),
    getSimilar(id),
    getComments(id),
  ]);

  if (!article) notFound();

  const readTime = Math.ceil(article.contenu.split(" ").length / 200);
  const similarMapped = similar.map((a: ApiArticle) => ({
    id: a.id, title: a.titre, slug: String(a.id),
    cover_image: a.image ?? "/assets/hero.png",
  }));

  return (
    <div className="min-h-screen pt-16">
      <ArticleHero coverImage={article.image ?? "/assets/hero.png"} title={article.titre} />

      <main className="container py-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
        <Sidebar />
        <div>
          <ArticleMeta articleId={article.id}
            authorName={article.auteur}
            publishedAt={article.date_creation}
            readTime={readTime}
            views={article.vues}
          />
          <ArticleContent content={article.contenu} />

          {/* Interactions (like, favori, commentaires) restent client */}
          <ArticleInteractions
            articleId={article.id}
            initialLikes={article.nb_likes}
            articleTitle={article.titre}
            initialComments={comments}
          />

          <SimilarArticles articles={similarMapped} />
        </div>
      </main>
    </div>
  );
}
