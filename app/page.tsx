import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import Pagination from "@/components/Pagination";
import { type ApiPaginatedArticles } from "@/lib/api";

export const metadata: Metadata = {
  title: "EduBlog — Votre avenir professionnel commence ici",
  description:
    "Articles sur l'orientation, la carrière, les opportunités et le développement personnel pour la jeunesse africaine.",
  openGraph: {
    title:       "EduBlog",
    description: "Formation, conseils et opportunités pour construire la carrière de vos rêves.",
    type:        "website",
  },
};

// Fetch côté serveur (Server Component) — meilleur SEO, 0 JS inutile côté client
const EMPTY: ApiPaginatedArticles = { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };

async function fetchArticles(page = 1): Promise<ApiPaginatedArticles> {
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(
      `${BASE}/articles?statut=publie&page=${page}&limit=12`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return EMPTY;
    return res.json();
  } catch {
    return EMPTY;
  }
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page: pageParam } = await searchParams;
  const page     = Math.max(1, parseInt(pageParam ?? "1") || 1);
  const { data: articles, pagination } = await fetchArticles(page);

  const featured = page === 1 ? (articles.find((a) => a.nb_likes >= 5) ?? articles[0] ?? null) : null;
  const rest     = featured ? articles.filter((a) => a.id !== featured.id) : articles;

  return (
    <div className="min-h-screen bg-background font-body pt-16">
      {page === 1 && (
        <Hero
          backgroundImage="/assets/hero.png"
          title="Votre avenir professionnel commence ici"
          description="Formation, conseils professionnels et opportunités d'emploi pour construire la carrière de vos rêves."
        />
      )}

      <main className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
          <Sidebar />
          <div>
            {articles.length === 0 ? (
              <p className="text-center text-base-content/60 py-20">
                Aucun article disponible pour le moment.
              </p>
            ) : (
              <>
                {featured && page === 1 && (
                  <section className="mb-12">
                    <h2 className="mb-6 font-display text-2xl font-bold">À la une</h2>
                    <Link href={`/article/${featured.id}`}>
                      <ArticleCard
                        title={featured.titre}
                        excerpt={featured.contenu.slice(0, 200) + "..."}
                        category_id={featured.categorie_id ?? 0}
                        category_name={featured.categorie ?? undefined}
                        read_time={Math.ceil(featured.contenu.split(" ").length / 200)}
                        published_at={featured.date_creation}
                        cover_image={featured.image ?? "/assets/hero.png"}
                        likes={featured.nb_likes}
                        views={featured.vues}
                        author_id={0}
                        tags={featured.tags}
                        isfeatured
                      />
                    </Link>
                  </section>
                )}

                <section>
                  <h2 className="mb-6 font-display text-2xl font-bold">
                    {page === 1 ? "Articles récents" : `Page ${page}`}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article) => (
                      <Link key={article.id} href={`/article/${article.id}`}>
                        <ArticleCard
                          title={article.titre}
                          excerpt={article.contenu.slice(0, 150) + "..."}
                          category_id={article.categorie_id ?? 0}
                          category_name={article.categorie ?? undefined}
                          read_time={Math.ceil(article.contenu.split(" ").length / 200)}
                          published_at={article.date_creation}
                          cover_image={article.image ?? "/assets/hero.png"}
                          likes={article.nb_likes}
                          views={article.vues}
                          author_id={0}
                          tags={article.tags}
                        />
                      </Link>
                    ))}
                  </div>

                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                  />
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}