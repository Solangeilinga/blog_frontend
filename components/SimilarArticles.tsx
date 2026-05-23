import Link from "next/link";
import Image from "next/image";
import Card from "./Card";

interface SimilarArticle {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
}

interface SimilarArticlesProps {
  articles: SimilarArticle[];
}

export default function SimilarArticles({ articles }: SimilarArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Articles similaires</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`} className="block">
            <Card>
              <figure className="relative h-48 w-full">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h4 className="card-title text-base line-clamp-2">
                  {article.title}
                </h4>
                <div className="card-actions justify-end mt-2">
                  <span className="text-xs text-primary">Lire plus →</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}