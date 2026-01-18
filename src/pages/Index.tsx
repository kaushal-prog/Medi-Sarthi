import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { AboutSection } from "@/components/AboutSection";
import { DoctorsSection } from "@/components/DoctorsSection";
import { AIDoctor } from "@/components/AIDoctor";
import { SymptomChecker } from "@/components/SymptomChecker";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DepartmentsSection />
      <AboutSection />
      <DoctorsSection />
      <AIDoctor />
      <SymptomChecker />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
