import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import StorySection from "@/components/StorySection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid limit={3} />
      <StorySection />
      <FAQSection />
    </>
  );
}


