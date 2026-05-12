import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import StorySection from "@/components/StorySection";
import FAQSection from "@/components/FAQSection";
import QuizSection from "@/components/QuizSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid limit={4} />
      <QuizSection />
      <StorySection />
      <FAQSection />
    </>
  );
}


