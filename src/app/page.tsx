import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import PracticeAreas from "@/components/PracticeAreas";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <div id="home">
          <HeroSection />
        </div>
        <div id="about" className="max-w-6xl mx-auto">
          <AboutSection />
        </div>
        <div id="practice" className="max-w-6xl mx-auto">
          <PracticeAreas />
        </div>
        <div id="contact" className="max-w-6xl mx-auto">
          <ContactSection />
        </div>
      </main>
    </div>
  );
}
