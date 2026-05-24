"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { categoriesApi, type ApiCategory } from "@/lib/api";

// CORRIGÉ : fonction de normalisation de slug
// Avant : .replace(/\s+/g, "") → "Développement perso" devenait "/développementperso"
// Après : suppression des accents + remplacement espaces par tirets → "/developpement-perso"
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")                    // décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "")    // supprime les diacritiques (accents)
    .replace(/[^a-z0-9\s-]/g, "")       // supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, "-");              // remplace les espaces par des tirets
}

const Sidebar = () => {
  const [open,       setOpen]       = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .catch(() => {});
  }, []);

  return (
    <aside className="w-full lg:sticky lg:top-20">

      {/* Bouton collapse mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-base-200 border-2 border-base-300 font-bold text-base-content mb-2"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Catégories
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      <div className={`rounded-2xl bg-base-200 border-2 border-base-300 shadow-md p-5 ${open ? "block" : "hidden"} lg:block`}>

        <div className="hidden lg:flex items-center gap-2 mb-5 pb-4 border-b-2 border-base-300">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-base uppercase tracking-wider text-base-content">
            Catégories
          </h3>
        </div>

        {categories.length === 0 ? (
          <ul className="flex flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <li key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  // CORRIGÉ : utilise toSlug() comme fallback si le slug DB est absent
                  // Résultat : "/developpement-perso" au lieu de "/développementperso"
                  href={`/${cat.slug ?? toSlug(cat.name)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium bg-base-100 border border-base-300 text-base-content hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-200 group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{cat.emoji ?? "📁"}</span>
                    {cat.name}
                  </span>
                  <span className="text-xs bg-base-200 group-hover:bg-white/30 group-hover:text-white px-2.5 py-1 rounded-full font-bold transition-all border border-base-300 group-hover:border-white/30">
                    {cat.articles_count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;