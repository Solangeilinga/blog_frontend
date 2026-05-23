"use client";

/**
 * ViewTracker — composant invisible qui :
 * 1. Affiche le compteur de vues en temps réel (depuis le serveur + 1)
 * 2. Évite de compter plusieurs fois si l'utilisateur recharge la page
 *    en utilisant sessionStorage (côté client uniquement)
 */

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

interface ViewTrackerProps {
  articleId:    number;
  initialViews: number; // vues déjà comptées côté serveur (SSR)
}

export default function ViewTracker({ articleId, initialViews }: ViewTrackerProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `viewed_${articleId}`;
    // Si déjà compté dans cette session, on affiche juste le chiffre
    if (sessionStorage.getItem(key)) return;

    // Sinon on incrémente côté client (le backend incrémente aussi à chaque GET)
    sessionStorage.setItem(key, "1");
    setViews((v) => v + 1);
  }, [articleId]);

  return (
    <span className="flex items-center gap-1 text-base-content/60">
      <Eye className="h-4 w-4" />
      <span className="tabular-nums">
        {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
      </span>
      <span className="sr-only">vues</span>
    </span>
  );
}
