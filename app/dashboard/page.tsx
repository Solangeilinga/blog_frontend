"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, Heart, MessageCircle, FileText,
  PenLine, Trash2, BarChart2, BookOpen,
  CheckCircle, Clock, TrendingUp, Plus,
  Edit
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import {
  dashboardApi,
  type AuthorStats,
  type DashboardArticle,
} from "@/lib/api";

// ── Carte stat ───────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, color,
}: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-base-content/60">{label}</p>
      </div>
    </div>
  );
}

// ── Badge statut ─────────────────────────────────────────────────────────────
function StatusBadge({ statut }: { statut: "publie" | "brouillon" }) {
  return statut === "publie" ? (
    <span className="badge badge-success gap-1 text-xs">
      <CheckCircle className="h-3 w-3" /> Publié
    </span>
  ) : (
    <span className="badge badge-warning gap-1 text-xs">
      <Clock className="h-3 w-3" /> Brouillon
    </span>
  );
}

// ── Page Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats,    setStats]    = useState<AuthorStats | null>(null);
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [filter,   setFilter]   = useState<"tous" | "publie" | "brouillon">("tous");
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [error,    setError]    = useState("");

  // Redirection si non connecté ou mauvais rôle
  useEffect(() => {
    if (!authLoading && (!isLoggedIn || (user?.role === "lecteur"))) {
      router.replace("/");
    }
  }, [authLoading, isLoggedIn, user, router]);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const [statsData, articlesData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getMyArticles({
          page,
          limit: 10,
          statut: filter === "tous" ? undefined : filter,
        }),
      ]);
      setStats(statsData);
      setArticles(articlesData.data);
      setPagination(articlesData.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isLoggedIn && user?.role !== "lecteur") fetchData(1);
  }, [fetchData, isLoggedIn, user]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await dashboardApi.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirm(null);
      if (stats) {
        const deleted = articles.find((a) => a.id === id);
        setStats({
          ...stats,
          total_articles: stats.total_articles - 1,
          articles_publies: stats.articles_publies - (deleted?.statut === "publie" ? 1 : 0),
          articles_brouillons: stats.articles_brouillons - (deleted?.statut === "brouillon" ? 1 : 0),
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  // Formatage des grands nombres
  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  if (authLoading || (!isLoggedIn && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-base-200/40">
      <div className="container py-8 max-w-5xl mx-auto px-4">

        {/* ── En-tête ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-primary" />
              Tableau de bord
            </h1>
            <p className="text-base-content/60 mt-1">
              Bienvenue, <span className="font-semibold text-primary">{user?.username}</span> 👋
            </p>
          </div>
          <Link href="/NewArticle" className="btn btn-primary gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Nouvel article
          </Link>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setError("")}>✕</button>
          </div>
        )}

        {/* ── Cartes stats ── */}
        {loading && !stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total articles"  value={stats.total_articles}      icon={FileText}      color="bg-blue-500" />
            <StatCard label="Publiés"          value={stats.articles_publies}    icon={CheckCircle}   color="bg-green-500" />
            <StatCard label="Brouillons"       value={stats.articles_brouillons} icon={Clock}         color="bg-amber-500" />
            <StatCard label="Vues totales"     value={fmt(stats.total_vues)}     icon={TrendingUp}    color="bg-purple-500" />
            <StatCard label="Likes reçus"      value={fmt(stats.total_likes)}    icon={Heart}         color="bg-rose-500" />
            <StatCard label="Commentaires"     value={fmt(stats.total_comments)} icon={MessageCircle} color="bg-teal-500" />
          </div>
        )}

        {/* ── Table articles ── */}
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">

          {/* Header table */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-base-300">
            <h2 className="font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Mes articles
              {pagination.total > 0 && (
                <span className="badge badge-primary badge-sm">{pagination.total}</span>
              )}
            </h2>

            {/* Filtres */}
            <div className="join">
              {(["tous", "publie", "brouillon"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); fetchData(1); }}
                  className={`join-item btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
                >
                  {f === "tous" ? "Tous" : f === "publie" ? "✅ Publiés" : "📝 Brouillons"}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <PenLine className="h-12 w-12 mx-auto text-base-content/20 mb-3" />
              <p className="text-base-content/50 mb-4">
                {filter === "tous"
                  ? "Vous n'avez encore publié aucun article."
                  : `Aucun article avec le statut « ${filter} ».`}
              </p>
              <Link href="/NewArticle" className="btn btn-primary btn-sm">
                Créer mon premier article
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="text-base-content/60 text-xs uppercase">
                      <th>Article</th>
                      <th>Statut</th>
                      <th className="text-center"><Eye className="h-4 w-4 inline" /> Vues</th>
                      <th className="text-center"><Heart className="h-4 w-4 inline" /> Likes</th>
                      <th className="text-center"><MessageCircle className="h-4 w-4 inline" /> Comms</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="hover">
                        <td className="max-w-xs">
                          <Link href={`/article/${article.id}`}
                            className="font-medium hover:text-primary line-clamp-2 transition-colors">
                            {article.titre}
                          </Link>
                          {article.categorie && (
                            <p className="text-xs text-base-content/50 mt-0.5">{article.categorie}</p>
                          )}
                        </td>
                        <td><StatusBadge statut={article.statut} /></td>
                        <td className="text-center font-mono text-sm">{fmt(article.vues)}</td>
                        <td className="text-center font-mono text-sm">{fmt(article.nb_likes)}</td>
                        <td className="text-center font-mono text-sm">{article.nb_comments}</td>
                        <td className="text-sm text-base-content/60 whitespace-nowrap">
                          {new Date(article.date_creation).toLocaleDateString("fr-FR")}
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <Link href={`/article/${article.id}`}
                              className="btn btn-ghost btn-xs" title="Voir">
                              <Eye className="h-3 w-3" />
                            </Link>
                            <Link href={`/NewArticle?edit=${article.id}`}
                              className="btn btn-ghost btn-xs" title="Modifier">
                              <Edit className="h-3 w-3" />
                            </Link>
                            {deleteConfirm === article.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(article.id)}
                                  disabled={deleting === article.id}
                                  className="btn btn-error btn-xs"
                                >
                                  {deleting === article.id
                                    ? <span className="loading loading-spinner loading-xs" />
                                    : "Confirmer"}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="btn btn-ghost btn-xs">
                                  Annuler
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(article.id)}
                                className="btn btn-ghost btn-xs text-error" title="Supprimer">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-base-300">
                {articles.map((article) => (
                  <div key={article.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/article/${article.id}`}
                        className="font-medium hover:text-primary line-clamp-2 text-sm">
                        {article.titre}
                      </Link>
                      <StatusBadge statut={article.statut} />
                    </div>
                    <div className="flex gap-4 text-xs text-base-content/60">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {fmt(article.vues)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {fmt(article.nb_likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {article.nb_comments}
                      </span>
                      <span>{new Date(article.date_creation).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/article/${article.id}`} className="btn btn-ghost btn-xs">
                        <Eye className="h-3 w-3" /> Voir
                      </Link>
                      <Link href={`/NewArticle?edit=${article.id}`} className="btn btn-ghost btn-xs">
                        <Edit className="h-3 w-3" /> Modifier
                      </Link>
                      {deleteConfirm === article.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={deleting === article.id}
                            className="btn btn-error btn-xs">
                            {deleting === article.id
                              ? <span className="loading loading-spinner loading-xs" />
                              : "Confirmer"}
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost btn-xs">
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(article.id)}
                          className="btn btn-ghost btn-xs text-error">
                          <Trash2 className="h-3 w-3" /> Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 px-4 py-4 border-t border-base-300">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchData(p)}
                      className={`btn btn-sm ${p === pagination.page ? "btn-primary" : "btn-ghost"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Accès rapides ── */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <Link href="/NewArticle"
            className="flex items-center gap-3 p-4 bg-base-100 border border-base-300 rounded-xl hover:border-primary hover:shadow-sm transition-all group">
            <div className="bg-primary/10 rounded-lg p-2 group-hover:bg-primary/20 transition-colors">
              <PenLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Écrire un article</p>
              <p className="text-xs text-base-content/50">Partager vos connaissances</p>
            </div>
          </Link>
          <Link href="/"
            className="flex items-center gap-3 p-4 bg-base-100 border border-base-300 rounded-xl hover:border-primary hover:shadow-sm transition-all group">
            <div className="bg-primary/10 rounded-lg p-2 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Voir tous les articles</p>
              <p className="text-xs text-base-content/50">Parcourir le blog</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}