import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import Hero from "@/components/Hero";
export const metadata: Metadata = { title: "Éducation — EduBlog", description: "Formation, apprentissage et développement des connaissances." };
export default function Education() {
  return (
    <main className="min-h-screen bg-background font-body pt-16">
      <Hero backgroundImage="/assets/hero.png" title="🎓 Éducation" description="Formation, apprentissage et développement des connaissances." />
      <CategoryPage categoryId={1} title="Éducation" description="Formation, apprentissage et développement des connaissances." />
    </main>
  );
}