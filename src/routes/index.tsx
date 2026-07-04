import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { CategoriesGrid } from "@/components/site/CategoriesGrid";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { PromoBanner } from "@/components/site/PromoBanner";
import { VipDrops } from "@/components/site/VipDrops";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";

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
        content: "Drops 2025/26, retrôs raras e conjuntos completos. Direto na sua porta em 48h.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar />
      <CartDrawer />
      <Hero />
      <div className="relative">
        <CategoriesGrid />
        <FeaturedProducts />
        <PromoBanner />
        <VipDrops />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
