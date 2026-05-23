"use client";

import { useState } from "react";
import ArticleActions  from "./ArticleActions";
import CommentSection  from "./CommentSection";
import type { ApiComment } from "@/lib/api";
import type { Comment }    from "./CommentSection";

function mapApiComment(c: ApiComment): Comment {
  return {
    id:           String(c.id),
    article_id:   c.article_id,
    author_name:  c.auteur,
    content:      c.contenu,
    published_at: c.date,
    likes:        0,
    liked:        false,
    replies:      (c.reponses ?? []).map(mapApiComment),
  };
}

interface Props {
  articleId:        number;
  initialLikes:     number;
  articleTitle:     string;
  initialComments:  ApiComment[];
}

export default function ArticleInteractions({
  articleId, initialLikes, articleTitle, initialComments,
}: Props) {
  const [liked, setLiked] = useState(false);
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <ArticleActions
        articleId={articleId}
        initialLikes={initialLikes}
        articleTitle={articleTitle}
        articleUrl={articleUrl}
        liked={liked}
        onLikeChange={setLiked}
      />
      <CommentSection
        articleId={articleId}
        initialComments={initialComments.map(mapApiComment)}
      />
    </>
  );
}
