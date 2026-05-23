import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";
import Hero from "@/components/Hero";
export const metadata: Metadata = { title: "Technologie — EduBlog", description: "Tech, numérique, IA et innovation au service du développement." };
export default function Technologie() {
  return (
    <main className="min-h-screen bg-background font-body pt-16">
      <Hero backgroundImage="/assets/hero.png" title="🧠 Technologie" description="Tech, numérique, IA et innovation au service du développement." />
      <CategoryPage categoryId={4} title="Technologie" description="Tech, numérique, IA et innovation au service du développement." />
    </main>
  );
}