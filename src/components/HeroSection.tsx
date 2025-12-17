import { Button } from '@/components/ui/button';
import ConsultationModal from './ConsultationModal';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-bg-img flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute hero-overlay w-full h-screen"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          M. John Abraham 
          <span className="block text-[#d4af37] text-2xl md:text-3xl font-normal mt-2">Attorney at Law</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">Providing experienced legal counsel with integrity, dedication, and results that matter.</p>

        <div className="flex-col sm:flex-row gap-4 justify-center">
          <ConsultationModal>
            <Button variant="gold" size="lg" className="text-lg px-8 py-3">
              Schedule Consultation
            </Button>
          </ConsultationModal>
          <Button variant="outline" size="lg" className="text-lg hidden px-8 py-3 border-white text-white hover:bg-white hover:text-[#001f3f]">
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className=" hidden bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
