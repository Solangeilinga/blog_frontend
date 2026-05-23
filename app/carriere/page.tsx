import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import Hero from "@/components/Hero";
export const metadata: Metadata = { title: "Carrière — EduBlog", description: "Conseils pour évoluer et réussir dans votre vie professionnelle." };
export default function Carriere() {
  return (
    <main className="min-h-screen bg-background font-body pt-16">
      <Hero backgroundImage="/assets/hero.png" title="💼 Carrière" description="Conseils pour évoluer et réussir dans votre vie professionnelle." />
      <CategoryPage categoryId={2} title="Carrière" description="Conseils pour évoluer et réussir dans votre vie professionnelle." />
    </main>
  );
}