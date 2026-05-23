"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import Alert from "./Alert";
import { commentsApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

export type Comment = {
  id: string;
  article_id: number;
  author_name: string;
  content: string;
  published_at: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
};

export default function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: number;
  initialComments: Comment[];
}) {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!isLoggedIn || !user) {
      (document.getElementById("login_modal") as HTMLDialogElement)?.showModal();
      return;
    }
    setSubmitError("");
    try {
      await commentsApi.create({
        auteur: user.username,
        contenu: commentText,
        article_id: articleId,
      });
      // Recharge les commentaires depuis l'API
      const fresh = await commentsApi.getByArticle(articleId);
      setComments(
        fresh.map((c) => ({
          id: String(c.id),
          article_id: c.article_id,
          author_name: c.auteur,
          content: c.contenu,
          published_at: c.date,
          likes: 0,
          liked: false,
          replies: (c.reponses || []).map((r) => ({
            id: String(r.id),
            article_id: r.article_id,
            author_name: r.auteur,
            content: r.contenu,
            published_at: r.date,
            likes: 0,
            liked: false,
          })),
        }))
      );
      setCommentText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Erreur lors de la publication.");
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    if (!isLoggedIn || !user) {
      (document.getElementById("login_modal") as HTMLDialogElement)?.showModal();
      return;
    }
    try {
      await commentsApi.create({
        auteur: user.username,
        contenu: replyText,
        article_id: articleId,
        parent_id: parseInt(commentId),
      });
      const fresh = await commentsApi.getByArticle(articleId);
      setComments(
        fresh.map((c) => ({
          id: String(c.id),
          article_id: c.article_id,
          author_name: c.auteur,
          content: c.contenu,
          published_at: c.date,
          likes: 0,
          liked: false,
          replies: (c.reponses || []).map((r) => ({
            id: String(r.id),
            article_id: r.article_id,
            author_name: r.auteur,
            content: r.contenu,
            published_at: r.date,
            likes: 0,
            liked: false,
          })),
        }))
      );
      setReplyText("");
      setReplyingTo(null);
    } catch {
      // silencieux
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Commentaires ({comments.length})
      </h2>

      <Card>
        <div className="p-4 space-y-3">
          {submitted && <Alert variant="success">Commentaire publié !</Alert>}
          {submitError && <Alert variant="error">{submitError}</Alert>}
          {!isLoggedIn && (
            <p className="text-sm text-base-content/60">
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() =>
                  (document.getElementById("login_modal") as HTMLDialogElement)?.showModal()
                }
              >
                Connectez-vous
              </button>{" "}
              pour laisser un commentaire.
            </p>
          )}
          <textarea
            rows={3}
            placeholder={isLoggedIn ? "Votre commentaire..." : "Connectez-vous pour commenter"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!isLoggedIn}
            className="textarea textarea-bordered w-full text-sm"
          />
          <Button
            onClick={handleAddComment}
            disabled={!commentText.trim() || !isLoggedIn}
            variant="primary"
            className="w-full md:w-auto"
          >
            <MessageCircle className="h-4 w-4 mr-2" /> Publier
          </Button>
        </div>
      </Card>

      <div className="space-y-3 mt-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun commentaire pour le moment.</p>
        ) : (
          comments.map((c) => (
            <Card key={c.id}>
              <div className="p-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{c.author_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.published_at).toLocaleDateString("fr-FR", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                    <p className="text-sm mt-1">{c.content}</p>
                  </div>
                  <Button onClick={() => handleCommentLike(c.id)} variant="ghost" size="sm" className="self-end sm:self-auto">
                    <Heart className={`h-3 w-3 mr-1 ${c.liked ? "fill-current text-red-500" : ""}`} />
                    {c.likes}
                  </Button>
                </div>

                {isLoggedIn && (
                  <Button onClick={() => setReplyingTo(c.id)} variant="ghost" size="sm" className="mt-1">
                    Répondre
                  </Button>
                )}

                {replyingTo === c.id && (
                  <div className="mt-2 pl-2 sm:pl-4">
                    <textarea
                      rows={2}
                      placeholder="Votre réponse..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="textarea textarea-bordered w-full text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleReply(c.id)} variant="primary" size="sm">Envoyer</Button>
                      <Button onClick={() => setReplyingTo(null)} variant="ghost" size="sm">Annuler</Button>
                    </div>
                  </div>
                )}

                {c.replies && c.replies.length > 0 && (
                  <div className="mt-3 pl-3 sm:pl-6 border-l space-y-2">
                    {c.replies.map((r) => (
                      <div key={r.id} className="text-sm">
                        <p className="font-semibold text-xs">{r.author_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(r.published_at).toLocaleDateString("fr-FR")}
                        </p>
                        <p className="text-sm">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
