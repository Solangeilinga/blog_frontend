import { Clock } from "lucide-react";
import ViewTracker from "./ViewTracker";

interface ArticleMetaProps {
  authorName:  string;
  publishedAt: string;
  readTime:    number;
  views:       number;
  articleId:   number;
}

export default function ArticleMeta({
  authorName, publishedAt, readTime, views, articleId,
}: ArticleMetaProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 border-b pb-4 gap-3">
      <div>
        <p className="font-bold">{authorName}</p>
        <p className="text-sm text-base-content/50">
          {new Date(publishedAt).toLocaleDateString("fr-FR", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-base-content/60">
          <Clock className="h-4 w-4" />
          {readTime} min de lecture
        </span>
        {/* ViewTracker : vues en temps réel sans recompte dans la même session */}
        <ViewTracker articleId={articleId} initialViews={views} />
      </div>
    </div>
  );
}
