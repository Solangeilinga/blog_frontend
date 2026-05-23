"use client";
import React, { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import FormControl from "@/components/Formcontrol";
import { articlesApi, categoriesApi, type ApiCategory } from "@/lib/api";
import { useAuth } from "./AuthContext";

const ArticleForm = () => {
  const { user }       = useAuth();
  const router         = useRouter();
  const searchParams   = useSearchParams();
  const editId         = searchParams.get("edit"); // ?edit=42 → mode édition
  const fileRef        = useRef<HTMLInputElement>(null);

  const [title,    setTitle]    = React.useState("");
  const [category, setCategory] = React.useState("");
  const [content,  setContent]  = React.useState("");
  const [statut,   setStatut]   = React.useState<"publie"|"brouillon">("publie");
  const [loading,  setLoading]  = React.useState(false);
  const [fetching, setFetching] = React.useState(!!editId);
  const [success,  setSuccess]  = React.useState(false);
  const [apiError, setApiError] = React.useState("");
  const [errors,   setErrors]   = React.useState({ title: "", category: "", content: "" });
  const [categories, setCategories] = React.useState<ApiCategory[]>([]);

  // Charger les catégories depuis l'API
  React.useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  // ── Précharger l'article si mode édition ──────────────────────────────────
  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    articlesApi.getOne(Number(editId))
      .then((article) => {
        setTitle(article.titre);
        setContent(article.contenu);
        setCategory(article.categorie_id ? String(article.categorie_id) : "");
        setStatut(article.statut);
      })
      .catch(() => setApiError("Impossible de charger l'article à modifier."))
      .finally(() => setFetching(false));
  }, [editId]);

  const validate = () => {
    const e = { title: "", category: "", content: "" };
    if (!title.trim())   e.title    = "Le titre est requis";
    if (!category)       e.category = "La catégorie est requise";
    if (!content.trim()) e.content  = "Le contenu est requis";
    setErrors(e);
    return !Object.values(e).some((v) => v !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("titre",        title);
    formData.append("auteur",       user?.username ?? "Anonyme");
    formData.append("contenu",      content);
    formData.append("categorie_id", category);
    formData.append("statut",       statut);
    if (fileRef.current?.files?.[0]) {
      formData.append("image", fileRef.current.files[0]);
    }

    setLoading(true);
    setApiError("");
    try {
      if (editId) {
        // Mode édition — PUT /articles/:id
        await articlesApi.update(Number(editId), formData);
        setSuccess(true);
        setTimeout(() => router.push(`/article/${editId}`), 1500);
      } else {
        // Mode création — POST /articles
        const res = await articlesApi.create(formData);
        setSuccess(true);
        setTimeout(() => router.push(`/article/${res.id}`), 1500);
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Erreur lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <p className="text-5xl mb-4">{editId ? "✅" : "🎉"}</p>
          <h2 className="text-2xl font-bold mb-2">
            {editId ? "Article modifié !" : "Article publié !"}
          </h2>
          <p className="text-base-content/60">Redirection vers votre article...</p>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-2xl bg-base-100 border border-base-300 rounded-2xl shadow-sm p-8 flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-base-content">
            {editId ? "Modifier l'article" : "Créer un article"}
          </h1>
          {editId && (
            <span className="badge badge-warning">Mode édition</span>
          )}
        </div>

        {apiError && <div className="alert alert-error text-sm">{apiError}</div>}

        <FormControl label="Titre" error={errors.title}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full" placeholder="Titre de l'article" />
        </FormControl>

        <div className="form-control w-full">
          <label className="label"><span className="label-text font-medium">Auteur</span></label>
          <input type="text" value={user?.username ?? ""} readOnly
            className="input input-bordered w-full bg-base-200 cursor-not-allowed" />
        </div>

        <FormControl label="Catégorie" error={errors.category}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-full">
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji ?? "📁"} {cat.name}
              </option>
            ))}
          </select>
        </FormControl>

        <div className="form-control w-full">
          <label className="label"><span className="label-text font-medium">Statut</span></label>
          <select value={statut}
            onChange={(e) => setStatut(e.target.value as "publie"|"brouillon")}
            className="select select-bordered w-full">
            <option value="publie">✅ Publié</option>
            <option value="brouillon">📝 Brouillon</option>
          </select>
        </div>

        <FormControl label={editId ? "Nouvelle image (optionnel)" : "Image de couverture"}>
          <input ref={fileRef} type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="file-input file-input-bordered w-full" />
          {editId && (
            <p className="text-xs text-base-content/50 mt-1">
              Laisser vide pour conserver l&apos;image actuelle.
            </p>
          )}
        </FormControl>

        <FormControl label="Contenu" error={errors.content}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full" rows={12}
            placeholder="Rédigez votre article..." />
        </FormControl>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" wide disabled={loading}>
            {loading
              ? (editId ? "Modification en cours..." : "Publication en cours...")
              : (editId ? "Enregistrer les modifications" : "Publier")}
          </Button>
          {editId && (
            <button type="button" onClick={() => router.back()}
              className="btn btn-ghost">
              Annuler
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ArticleForm;