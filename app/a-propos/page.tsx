"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import Card from "@/components/Card";

const values = [
  {
    emoji: "💡",
    title: "Créer avec intention",
    desc: "J’aime construire des projets utiles, modernes et pensés pour résoudre de vrais problèmes.",
  },
  {
    emoji: "🌍",
    title: "Impact & innovation",
    desc: "La technologie est pour moi un moyen de créer des solutions accessibles et adaptées aux réalités africaines.",
  },
  {
    emoji: "📚",
    title: "Apprendre sans cesse",
    desc: "Je suis constamment en train d’explorer, tester et améliorer mes compétences à travers des projets concrets.",
  },
  {
    emoji: "✨",
    title: "Authenticité",
    desc: "Je crois aux projets construits avec passion, simplicité et une vraie vision derrière chaque détail.",
  },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen pt-16">
      <Hero
        backgroundImage="/assets/hero.png"
        title="À propos"
        description="Créer, apprendre et évoluer : voilà ma vision du futur."
      />

      {/* ── Présentation ── */}
      <section className="container max-w-4xl mx-auto py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Qui suis-je ?
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Une étudiante passionnée par la technologie,
            l’innovation et les projets à impact.
          </h1>

          <p className="text-base-content/70 leading-relaxed text-lg max-w-3xl mx-auto">
            Derrière chaque projet que je développe, il y a une envie simple :
            créer des solutions utiles, accessibles et modernes.
            J’aime transformer des idées en expériences concrètes,
            explorer de nouvelles technologies et apprendre constamment
            à travers la pratique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="card-body">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-xl">Ce qui me motive</h2>
              </div>

              <p className="text-base-content/70 leading-relaxed">
                Les projets qui combinent technologie, créativité
                et impact humain. Que ce soit dans l’éducation,
                les langues locales, la data ou les plateformes digitales,
                j’aime construire des outils qui peuvent réellement aider.
              </p>
            </div>
          </Card>

          <Card>
            <div className="card-body">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-xl">Ma vision</h2>
              </div>

              <p className="text-base-content/70 leading-relaxed">
                Utiliser la technologie comme un levier d’opportunités,
                d’apprentissage et d’évolution pour la jeunesse africaine,
                tout en construisant des produits élégants, utiles et durables.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
              Mes valeurs
            </p>

            <h2 className="text-3xl font-bold">
              La manière dont j’aime construire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {values.map((v) => (
              <Card key={v.title}>
                <div className="card-body">
                  <p className="text-3xl">{v.emoji}</p>
                  <h3 className="font-bold text-lg">{v.title}</h3>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section className="container max-w-3xl mx-auto py-20 text-center">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
          Portfolio
        </p>

        <h2 className="text-3xl font-bold mb-5">
          Découvrir mes projets et réalisations
        </h2>

        <p className="text-base-content/70 leading-relaxed mb-8">
          Applications web et mobiles, projets data, plateformes éducatives,
          solutions innovantes… Mon portfolio rassemble les projets
          qui reflètent mon évolution et ma passion pour la tech.
        </p>

        <Link
          href="https://solange-portfolio.netlify.app/"
          target="_blank"
          className="btn btn-primary gap-2 px-6"
        >
          Voir mon portfolio
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}