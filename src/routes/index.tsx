import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { BenefitsBar } from "@/components/site/BenefitsBar";
import { CategoriesGrid } from "@/components/site/CategoriesGrid";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { PromoBanner } from "@/components/site/PromoBanner";
import { Reviews } from "@/components/site/Reviews";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GN Football — Camisas de futebol premium" },
      {
        name: "description",
        content:
          "Camisas oficiais dos maiores times e seleções do mundo. Entrega rápida, qualidade premium e atendimento de campeão.",
      },
      { property: "og:title", content: "GN Football — Camisas de futebol premium" },
      {
        property: "og:description",
        content: "Drops 2025/26, retrôs raras e conjuntos completos. Direto pra sua porta em 48h.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar />
      <Hero />
      <BenefitsBar />
      <CategoriesGrid />
      <FeaturedProducts />
      <PromoBanner />
      <Reviews />
      <Footer />
    </main>
  );
}
