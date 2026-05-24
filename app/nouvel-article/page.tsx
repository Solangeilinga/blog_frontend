// CORRIGÉ : fichier déplacé de app/NewArticle/page.tsx → app/nouvel-article/page.tsx
// URL : /NewArticle (majuscule, anglais) → /nouvel-article (kebab-case, français)

import ArticleForm from '@/components/ArticleForm';
import Hero from '@/components/Hero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nouvel article — EduBlog',
  description: 'Rédigez et publiez un nouvel article sur EduBlog.',
  robots: { index: false, follow: false }, // page privée, pas d'indexation
};

export default function NouvelArticlePage() {
  return (
    <section className="min-h-screen bg-background font-body pt-16 pb-16">
      <Hero
        title="Créez votre propre article"
        description="Des cours adaptés à votre niveau."
        backgroundImage="/assets/hero.png"
      />
      <ArticleForm />
    </section>
  );
}