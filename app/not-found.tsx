import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — EduBlog",
  description: "Cette page n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background font-body pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-base-content mb-3">
          Page introuvable
        </h1>
        <p className="text-base-content/60 leading-relaxed mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
          Vérifie l&apos;URL ou retourne à l&apos;accueil.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/contact" className="btn btn-ghost border border-base-300">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}