"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { emailVerifyApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("Token manquant dans l'URL."); return; }

    emailVerifyApi.verify(token)
      .then((res) => { setStatus("success"); setMessage(res.message); })
      .catch((err) => { setStatus("error"); setMessage(err.message); });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8 text-center">

        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-xl font-bold">Vérification en cours...</h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h1 className="text-xl font-bold text-success mb-2">Email vérifié !</h1>
            <p className="text-base-content/60 mb-6">{message}</p>
            <button onClick={() => {
              router.push("/");
              setTimeout(() => (document.getElementById("login_modal") as HTMLDialogElement)?.showModal(), 300);
            }} className="btn btn-primary w-full">
              Se connecter
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-error mx-auto mb-4" />
            <h1 className="text-xl font-bold text-error mb-2">Lien invalide</h1>
            <p className="text-base-content/60 mb-6">{message}</p>
            <button onClick={() => router.push("/")} className="btn btn-ghost w-full">
              Retour à l&apos;accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
}