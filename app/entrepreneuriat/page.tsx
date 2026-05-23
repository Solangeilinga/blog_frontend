import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import Hero from "@/components/Hero";
export const metadata: Metadata = { title: "Entrepreneuriat — EduBlog", description: "Créer, développer et financer son entreprise en Afrique." };
export default function Entrepreneuriat() {
  return (
    <main className="min-h-screen bg-background font-body pt-16">
      <Hero backgroundImage="/assets/hero.png" title="🚀 Entrepreneuriat" description="Créer, développer et financer son entreprise en Afrique." />
      <CategoryPage categoryId={6} title="Entrepreneuriat" description="Créer, développer et financer son entreprise en Afrique." />
    </main>
  );
}