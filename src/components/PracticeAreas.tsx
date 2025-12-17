import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Briefcase, Shield, Users, FileText, TrendingUp } from "lucide-react";

const PracticeAreas = () => {
  const practiceAreas = [
    {
      icon: Building,
      title: "Corporate Law",
      description: "Comprehensive legal services for businesses of all sizes, including contracts, mergers, and compliance."
    },
    {
      icon: Home,
      title: "Real Estate Law",
      description: "Expert guidance for residential and commercial real estate transactions, disputes, and development."
    },
    {
      icon: Briefcase,
      title: "Employment Law",
      description: "Protecting rights and interests in workplace disputes, wrongful termination, and employment contracts."
    },
    {
      icon: Shield,
      title: "Criminal Defense",
      description: "Aggressive defense strategies for criminal charges with a proven track record of favorable outcomes."
    },
    {
      icon: Users,
      title: "Family Law",
      description: "Compassionate representation for divorce, custody, adoption, and other family-related legal matters."
    },
    {
      icon: FileText,
      title: "Estate Planning",
      description: "Comprehensive estate planning services including wills, trusts, and probate administration."
    },
    {
      icon: TrendingUp,
      title: "Loan and Investment",
      description: "Specialized legal guidance for loan agreements, investment structures, securities compliance, and financial regulatory matters."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#001f3f] mb-4">Practice Areas</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive legal services tailored to meet your specific needs with expertise across multiple practice areas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area, index) => (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0"
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-lg flex items-center justify-center mb-4">
                  <area.icon className="w-8 h-8 text-[#d4af37]" />
                </div>
                <CardTitle className="text-xl text-[#001f3f]">{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;