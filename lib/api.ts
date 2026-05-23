// Service API centralisé — toutes les requêtes passent ici
// - cookies httpOnly via credentials: "include"
// - refresh token automatique si 401
// - messages d'erreur traduits en français

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ApiUser {
  id: number;
  username: string;
  email: string;
  role: "lecteur" | "auteur" | "admin";
  bio?: string;
  avatar?: string;
}

export interface ApiArticle {
  id: number;
  titre: string;
  auteur: string;
  contenu: string;
  categorie_id: number | null;
  categorie?: string;
  statut: "brouillon" | "publie";
  image: string | null;
  vues: number;
  nb_likes: number;
  tags: string[];
  date_creation: string;
  user_id?: number;
}

export interface ApiPaginatedArticles {
  data: ApiArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiComment {
  id: number;
  auteur: string;
  contenu: string;
  article_id: number;
  parent_id: number | null;
  date: string;
  user_id: number | null;
  reponses?: ApiComment[];
}

export interface ApiCategory {
  id:             number;
  name:           string;
  emoji:          string | null;
  slug:           string | null;
  description:    string | null;
  articles_count: number;
}

// ── Messages d'erreur lisibles ─────────────────────────────────────────────
const ERROR_MAP: Record<string, string> = {
  "Email ou mot de passe incorrect": "Email ou mot de passe incorrect.",
  "Cet email est déjà utilisé":      "Cet email est déjà utilisé.",
  "Utilisateur non trouvé":          "Compte introuvable.",
  "Token invalide ou expiré":        "Lien expiré. Demandez un nouveau lien.",
  "Accès refusé":                    "Vous n'avez pas accès à cette ressource.",
  "Fichier trop volumineux":         "L'image doit faire moins de 5 Mo.",
};

const friendlyError = (msg: string): string => {
  for (const [key, friendly] of Object.entries(ERROR_MAP)) {
    if (msg.includes(key)) return friendly;
  }
  return msg || "Une erreur inattendue s'est produite.";
};

// ── Fetch de base avec retry refresh token ────────────────────────────────
let isRefreshing = false;

async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Access token expiré → on tente un refresh automatique (une seule fois)
  if (res.status === 401 && retry && !isRefreshing && path !== "/auth/refresh") {
    isRefreshing = true;
    try {
      await fetch(`${BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });
    } catch {
      // silencieux
    } finally {
      isRefreshing = false;
    }
    return apiFetch<T>(path, options, false); // 2e tentative sans retry
  }

  const data = await res.json().catch(() => ({ message: "Réponse invalide du serveur" }));
  if (!res.ok) throw new Error(friendlyError(data.message || "Erreur API"));
  return data as T;
}

// Pour les uploads multipart (FormData)
async function apiFetchForm<T>(path: string, formData: FormData, method = "POST"): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    body: formData,
  });
  const data = await res.json().catch(() => ({ message: "Réponse invalide du serveur" }));
  if (!res.ok) throw new Error(friendlyError(data.message || "Erreur API"));
  return data as T;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: { username: string; email: string; password: string; role?: string }) =>
    apiFetch<{ message: string; id: number }>("/auth/register", {
      method: "POST", body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ message: string; user: ApiUser }>("/auth/login", {
      method: "POST", body: JSON.stringify(body),
    }),

  logout: () =>
    apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),

  me: () =>
    apiFetch<{ user: ApiUser }>("/auth/me", {}, false), // pas de retry sur /me

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST", body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, new_password: string) =>
    apiFetch<{ message: string }>("/auth/reset-password", {
      method: "POST", body: JSON.stringify({ token, new_password }),
    }),
};

// ── ARTICLES ──────────────────────────────────────────────────────────────────
export const articlesApi = {
  getAll: (params?: {
    statut?: string; categorie_id?: number; search?: string;
    page?: number; limit?: number;
  }) => {
    const qs = params
      ? "?" + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return apiFetch<ApiPaginatedArticles>(`/articles${qs}`, {}, false);
  },

  getOne:    (id: number) => apiFetch<ApiArticle>(`/articles/${id}`, {}, false),
  getSimilar:(id: number) => apiFetch<ApiArticle[]>(`/articles/${id}/related`, {}, false),
  create:    (formData: FormData) => apiFetchForm<{ message: string; id: number }>("/articles", formData),
  update:    (id: number, formData: FormData) => apiFetchForm<{ message: string }>(`/articles/${id}`, formData, "PUT"),
  delete:    (id: number) => apiFetch<{ message: string }>(`/articles/${id}`, { method: "DELETE" }),

  like: (id: number) =>
    apiFetch<{ liked: boolean; nb_likes: number }>(`/articles/${id}/like`, { method: "POST" }),

  save: (id: number) =>
    apiFetch<{ saved: boolean }>(`/articles/${id}/save`, { method: "POST" }),
};

// ── COMMENTAIRES ──────────────────────────────────────────────────────────────
export const commentsApi = {
  getByArticle: (articleId: number) =>
    apiFetch<ApiComment[]>(`/comments/article/${articleId}`, {}, false),

  create: (body: { auteur: string; contenu: string; article_id: number; parent_id?: number }) =>
    apiFetch<{ message: string; id: number }>("/comments", {
      method: "POST", body: JSON.stringify(body),
    }),
};

// ── CATÉGORIES ────────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => apiFetch<ApiCategory[]>("/categories", {}, false),
};

// ── FAVORIS ───────────────────────────────────────────────────────────────────
export const favorisApi = {
  getMy: () => apiFetch<ApiArticle[]>("/favoris"),
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export interface AuthorStats {
  total_articles:    number;
  articles_publies:  number;
  articles_brouillons: number;
  total_vues:        number;
  total_likes:       number;
  total_comments:    number;
}

export interface DashboardArticle {
  id:           number;
  titre:        string;
  statut:       "publie" | "brouillon";
  vues:         number;
  nb_likes:     number;
  nb_comments:  number;
  date_creation: string;
  categorie:    string | null;
  image:        string | null;
}

export interface DashboardArticlesPaginated {
  data:       DashboardArticle[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const dashboardApi = {
  getStats: () =>
    apiFetch<AuthorStats>("/dashboard/stats"),

  getMyArticles: (params?: { page?: number; limit?: number; statut?: string }) => {
    const qs = params
      ? "?" + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : "";
    return apiFetch<DashboardArticlesPaginated>(`/dashboard/articles${qs}`);
  },

  deleteArticle: (id: number) =>
    apiFetch<{ message: string }>(`/articles/${id}`, { method: "DELETE" }),
};

// Extension authApi pour vérification email
// (s'ajoute aux fonctions existantes via export séparé)
export const emailVerifyApi = {
  verify: (token: string) =>
    apiFetch<{ message: string }>(`/auth/verify-email?token=${token}`, {}, false),

  resend: (email: string) =>
    apiFetch<{ message: string }>("/auth/resend-verification", {
      method: "POST", body: JSON.stringify({ email }),
    }, false),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST", body: JSON.stringify({ email }),
    }, false),

  resetPassword: (token: string, new_password: string) =>
    apiFetch<{ message: string }>("/auth/reset-password", {
      method: "POST", body: JSON.stringify({ token, new_password }),
    }, false),
};