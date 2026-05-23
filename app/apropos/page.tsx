"use client";
import Image from "next/image";
import { Github, Linkedin, Mail, Code2, BookOpen, Smartphone } from "lucide-react";
import Hero from "@/components/Hero";
import Card from "@/components/Card";

const skills = [
  { emoji: "⚛️",  label: "React / Next.js" },
  { emoji: "🟨",  label: "JavaScript / TypeScript" },
  { emoji: "🟢",  label: "Node.js / Express" },
  { emoji: "🗄️",  label: "MySQL / MongoDB" },
  { emoji: "📱",  label: "Développement Mobile" },
  { emoji: "🤖",  label: "Intelligence Artificielle" },
  { emoji: "☁️",  label: "Cloudinary / Brevo" },
  { emoji: "🎨",  label: "Tailwind CSS / DaisyUI" },
];

const values = [
  { emoji: "💡", title: "Curiosité",     desc: "Toujours en quête de nouvelles technologies et de meilleures façons de résoudre les problèmes." },
  { emoji: "🌍", title: "Impact Afrique",desc: "Créer des solutions numériques adaptées aux réalités et besoins du continent africain." },
  { emoji: "🚀", title: "Excellence",    desc: "Du code propre, des interfaces soignées et des expériences utilisateur fluides." },
  { emoji: "🤝", title: "Communauté",    desc: "Partager le savoir et contribuer à l'essor de la tech au féminin en Afrique." },
];

export default function AproposPage() {
  return (
    <div className="min-h-screen pt-16">

      <Hero
        backgroundImage="/assets/hero.png"
        title="À propos d'EduBlog"
        description="Une plateforme construite avec passion pour la jeunesse africaine"
      />

      {/* ── Développeuse ── */}
      <section className="container max-w-4xl mx-auto py-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <Image
              src="https://i.pravatar.cc/150?img=48"
              alt="Solange Ilinga"
              width={160}
              height={160}
              className="rounded-full object-cover border-4 border-primary shadow-lg"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
              Développeuse du site
            </p>
            <h2 className="text-3xl font-bold mb-1">Solange Ilinga</h2>
            <p className="text-base-content/50 text-sm mb-4">
              📍 République Démocratique du Congo
            </p>
            <p className="text-base-content/70 leading-relaxed mb-4">
              Étudiante passionnée de technologie, de data et d&apos;intelligence artificielle,
              j&apos;ai conçu et développé EduBlog de A à Z — du backend Node.js au frontend Next.js —
              avec l&apos;ambition de créer une plateforme utile pour la jeunesse africaine.
            </p>
            <p className="text-base-content/70 leading-relaxed">
              Ce projet est né de la conviction que le savoir professionnel doit être accessible
              à tous, gratuitement, et ancré dans les réalités du continent africain.
            </p>

            {/* Liens sociaux */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://github.com/Solangeilinga"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ghost gap-2 border border-base-300"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ghost gap-2 border border-base-300"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="mailto:solangeilinga@gmail.com"
                className="btn btn-sm btn-ghost gap-2 border border-base-300"
              >
                <Mail className="h-4 w-4" /> Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stack technique ── */}
      <section className="bg-base-200 py-14">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-center">Stack technique utilisée</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {skills.map((s) => (
              <div key={s.label}
                className="flex items-center gap-3 bg-base-100 border border-base-300 rounded-xl px-4 py-3 text-sm font-medium">
                <span className="text-xl">{s.emoji}</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission de la plateforme ── */}
      <section className="container max-w-3xl mx-auto py-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold text-primary uppercase tracking-widest">
            Mission de la plateforme
          </p>
        </div>
        <h2 className="text-3xl font-bold mb-4">Démocratiser le savoir professionnel</h2>
        <p className="text-base-content/60 leading-relaxed">
          EduBlog est né d&apos;un constat simple : les ressources de qualité sur l&apos;éducation,
          la carrière et les opportunités manquent dans le contexte africain.
          Cette plateforme propose des contenus ancrés dans les réalités locales —
          marché du travail, tech, culture d&apos;entreprise et opportunités régionales.
        </p>
      </section>

      {/* ── Valeurs ── */}
      <section className="bg-base-200 py-14">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Smartphone className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Valeurs du projet</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {values.map((v) => (
              <Card key={v.title}>
                <div className="card-body">
                  <p className="text-3xl">{v.emoji}</p>
                  <h3 className="font-bold text-lg">{v.title}</h3>
                  <p className="text-sm text-base-content/60">{v.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}