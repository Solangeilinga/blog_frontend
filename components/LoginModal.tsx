"use client";
import { useState } from "react";
import { X, Loader2, Mail } from "lucide-react";
import { useAuth } from "./AuthContext";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LoginModal = ({ id, registerModalId }: { id: string; registerModalId: string }) => {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(""); // email non vérifié
  const [resendSent, setResendSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setError("");
    setUnverifiedEmail("");
    setResendSent(false);
    try {
      await login(email, password);
      setEmail(""); setPassword("");
      (document.getElementById(id) as HTMLDialogElement)?.close();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de connexion.";
      // Détecter si c'est le cas email non vérifié
      if (msg.includes("vérifier votre email")) {
        setUnverifiedEmail(email);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await fetch(`${BASE}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      setResendSent(true);
    } catch {
      // silencieux
    } finally {
      setResendLoading(false);
    }
  };

  const goToRegister = () => {
    (document.getElementById(id) as HTMLDialogElement)?.close();
    (document.getElementById(registerModalId) as HTMLDialogElement)?.showModal();
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-sm">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
            <X className="h-4 w-4" />
          </button>
        </form>

        <h3 className="font-bold text-xl mb-1">Connexion</h3>
        <p className="text-sm text-base-content/60 mb-6">
          Connectez-vous à votre compte EduBlog.
        </p>

        {/* Cas email non vérifié */}
        {unverifiedEmail ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-amber-800 mb-2">
              <Mail className="h-4 w-4" /> Email non vérifié
            </div>
            <p className="text-amber-700 mb-3">
              Vérifiez votre boîte mail et cliquez sur le lien de confirmation.
            </p>
            {resendSent ? (
              <p className="text-green-700 font-medium">✅ Nouveau lien envoyé !</p>
            ) : (
              <button onClick={handleResend} disabled={resendLoading}
                className="btn btn-warning btn-sm w-full">
                {resendLoading
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : "Renvoyer l'email de vérification"}
              </button>
            )}
            <button onClick={() => setUnverifiedEmail("")}
              className="btn btn-ghost btn-sm w-full mt-2 text-base-content/60">
              ← Réessayer avec un autre compte
            </button>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

            <div className="flex flex-col gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Email</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com" className="input input-bordered w-full" />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Mot de passe</span>
                  <a href="/forgot-password" onClick={() => (document.getElementById(id) as HTMLDialogElement)?.close()}
                    className="label-text-alt text-primary hover:underline">
                    Mot de passe oublié ?
                  </a>
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="input input-bordered w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading} className="btn btn-primary w-full mt-6">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
            </button>

            <p className="text-sm text-center text-base-content/60 mt-4">
              Pas encore de compte ?{" "}
              <button onClick={goToRegister} className="text-primary font-semibold hover:underline">
                S&apos;inscrire
              </button>
            </p>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  );
};

export default LoginModal;