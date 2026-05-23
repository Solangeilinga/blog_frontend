"use client";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";

const RegisterModal = ({ id, loginModalId }: { id: string; loginModalId: string }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecteur");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(username, email, password, role);
      setUsername(""); setEmail(""); setPassword(""); setRole("lecteur");
      (document.getElementById(id) as HTMLDialogElement)?.close();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    (document.getElementById(id) as HTMLDialogElement)?.close();
    (document.getElementById(loginModalId) as HTMLDialogElement)?.showModal();
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-sm">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
            <X className="h-4 w-4" />
          </button>
        </form>

        <h3 className="font-bold text-xl mb-1">Créer un compte</h3>
        <p className="text-sm text-base-content/60 mb-6">
          Rejoignez la communauté et publiez vos articles.
        </p>

        {error && <div className="alert alert-error text-sm mb-4">❌ {error}</div>}

        <div className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">Nom d&apos;utilisateur</span></label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="aminata_diallo" className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">Email</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com" className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">Mot de passe</span></label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">Je suis</span></label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full">
              <option value="lecteur">Lecteur</option>
              <option value="auteur">Auteur (peut publier des articles)</option>
            </select>
          </div>
        </div>

        <button onClick={handleRegister} disabled={loading} className="btn btn-primary w-full mt-6">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "S'inscrire"}
        </button>

        <p className="text-sm text-center text-base-content/60 mt-4">
          Déjà un compte ?{" "}
          <button onClick={goToLogin} className="text-primary font-semibold hover:underline">
            Se connecter
          </button>
        </p>
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  );
};

export default RegisterModal;
