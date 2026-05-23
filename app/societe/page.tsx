import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import Hero from "@/components/Hero";
export const metadata: Metadata = { title: "Société — EduBlog", description: "Culture, vie sociale, citoyenneté et enjeux de société." };
export default function Societe() {
  return (
    <main className="min-h-screen bg-background font-body pt-16">
      <Hero backgroundImage="/assets/hero.png" title="🌱 Société" description="Culture, vie sociale, citoyenneté et enjeux de société." />
      <CategoryPage categoryId={5} title="Société" description="Culture, vie sociale, citoyenneté et enjeux de société." />
    </main>
  );
}