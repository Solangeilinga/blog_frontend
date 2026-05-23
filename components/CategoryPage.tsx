import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import Sidebar     from "@/components/Sidebar";
import Pagination  from "@/components/Pagination";
import { type ApiPaginatedArticles } from "@/lib/api";

interface CategoryPageProps {
  categoryId:   number;
  title:        string;
  description?: string;
  page?:        number;
}

async function fetchByCategory(categoryId: number, page = 1): Promise<ApiPaginatedArticles> {
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res  = await fetch(
    `${BASE}/articles?statut=publie&categorie_id=${categoryId}&page=${page}&limit=12`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  return res.json();
}

export default async function CategoryPage({
  categoryId, title, description, page = 1,
}: CategoryPageProps) {
  const { data: articles, pagination } = await fetchByCategory(categoryId, page);

  return (
    <div className="min-h-screen bg-background font-body pt-16">
      <div className="bg-primary/10 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && <p className="text-base-content/60">{description}</p>}
        </div>
      </div>

      <main className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">
          <Sidebar />
          <div>
            {articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-base-content/60 text-lg mb-6">
                  Aucun article dans cette catégorie pour le moment.
                </p>
                <Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}