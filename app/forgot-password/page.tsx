"use client";
import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { emailVerifyApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Veuillez entrer votre email."); return; }
    setLoading(true);
    setError("");
    try {
      await emailVerifyApi.forgotPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8">

        <Link href="/" className="flex items-center gap-2 text-sm text-base-content/60 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>

        {sent ? (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Email envoyé !</h1>
            <p className="text-base-content/60 mb-6">
              Si un compte existe avec <strong>{email}</strong>, vous recevrez
              un lien de réinitialisation dans quelques minutes.
            </p>
            <p className="text-sm text-base-content/50">
              Vérifiez aussi vos spams.
            </p>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="btn btn-ghost btn-sm mt-4">
              Réessayer avec un autre email
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 rounded-xl p-2">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mot de passe oublié ?</h1>
                <p className="text-sm text-base-content/60">
                  On vous envoie un lien de réinitialisation.
                </p>
              </div>
            </div>

            {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Votre adresse email</span>
                </label>
                <input type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="input input-bordered w-full" />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}