import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import Hero from "@/components/Hero";
export const metadata: Metadata = { title: "Opportunités — EduBlog", description: "Bourses, emplois et opportunités en Afrique et dans le monde." };
export default function Opportunites() {
  return (
    <main className="min-h-screen bg-background font-body pt-16">
      <Hero backgroundImage="/assets/hero.png" title="🌍 Opportunités" description="Bourses, emplois et opportunités en Afrique et dans le monde." />
      <CategoryPage categoryId={3} title="Opportunités" description="Bourses, emplois et opportunités en Afrique et dans le monde." />
    </main>
  );
}