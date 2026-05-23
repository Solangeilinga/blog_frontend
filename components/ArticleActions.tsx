"use client";

import { useState } from "react";
import { Heart, Bookmark, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import Button from "./Button";
import { articlesApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface ArticleActionsProps {
  articleId: number;
  initialLikes: number;
  articleTitle: string;
  articleUrl: string;
  liked: boolean;
  onLikeChange: (v: boolean) => void;
}

export default function ArticleActions({
  articleId,
  initialLikes,
  articleTitle,
  articleUrl,
  liked,
  onLikeChange,
}: ArticleActionsProps) {
  const { isLoggedIn } = useAuth();
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [saved, setSaved] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      (document.getElementById("login_modal") as HTMLDialogElement)?.showModal();
      return;
    }
    setLikeLoading(true);
    try {
      const res = await articlesApi.like(articleId);
      onLikeChange(res.liked);
      setLikesCount(res.nb_likes);
    } catch {
      // silencieux
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      (document.getElementById("login_modal") as HTMLDialogElement)?.showModal();
      return;
    }
    setSaveLoading(true);
    try {
      const res = await articlesApi.save(articleId);
      setSaved(res.saved);
    } catch {
      // silencieux
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedTitle = encodeURIComponent(articleTitle);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(articleUrl);
      alert("Lien copié !");
    } else {
      window.open(urls[platform]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-b py-4 my-6">
      <div className="flex gap-2">
        <Button onClick={handleLike} disabled={likeLoading} variant={liked ? "error" : "outline"} className="gap-2">
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          <span className="font-medium">{likesCount}</span>
        </Button>

        <Button onClick={handleSave} disabled={saveLoading} variant={saved ? "primary" : "outline"} className="gap-2">
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">{saved ? "Sauvegardé" : "Sauvegarder"}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span className="text-sm text-gray-500 mr-2 hidden sm:inline">Partager :</span>
        <div className="flex gap-1 sm:gap-2">
          {(["facebook", "twitter", "linkedin", "copy"] as const).map((p) => (
            <Button key={p} variant="ghost" onClick={() => handleShare(p)} size="sm">
              {p === "facebook" && <Facebook className="h-4 w-4" />}
              {p === "twitter" && <Twitter className="h-4 w-4" />}
              {p === "linkedin" && <Linkedin className="h-4 w-4" />}
              {p === "copy" && <Link2 className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
