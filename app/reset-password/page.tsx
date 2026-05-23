"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { emailVerifyApi } from "@/lib/api";

export default function ResetPasswordPage() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const token         = searchParams.get("token") ?? "";

  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (!token) { setError("Token manquant. Utilisez le lien reçu par email."); return; }

    setLoading(true);
    setError("");
    try {
      await emailVerifyApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8 text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Mot de passe modifié !</h1>
        <p className="text-base-content/60 mb-6">
          Votre mot de passe a été réinitialisé avec succès.
        </p>
        <button onClick={() => {
          router.push("/");
          setTimeout(() => (document.getElementById("login_modal") as HTMLDialogElement)?.showModal(), 300);
        }} className="btn btn-primary w-full">
          Se connecter
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8">

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 rounded-xl p-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Nouveau mot de passe</h1>
            <p className="text-sm text-base-content/60">Choisissez un mot de passe sécurisé.</p>
          </div>
        </div>

        {!token && (
          <div className="alert alert-error mb-4">
            Lien invalide. Utilisez le lien reçu par email.
          </div>
        )}
        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Nouveau mot de passe</span>
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="input input-bordered w-full pr-10"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Indicateur de force */}
            <div className="flex gap-1 mt-2">
              {[1,2,3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                  password.length >= i * 4
                    ? i === 1 ? "bg-error" : i === 2 ? "bg-warning" : "bg-success"
                    : "bg-base-300"
                }`} />
              ))}
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Confirmer le mot de passe</span>
            </label>
            <input
              type={showPwd ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Répétez le mot de passe"
              className={`input input-bordered w-full ${
                confirm && password !== confirm ? "input-error" : ""
              }`}
            />
            {confirm && password !== confirm && (
              <p className="text-error text-xs mt-1">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <button type="submit" disabled={loading || !token} className="btn btn-primary w-full mt-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer le nouveau mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}