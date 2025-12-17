import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Award, Users, BookOpen } from "lucide-react";
import Image from "next/image";

const AboutSection = () => {
  const credentials = [
    "J.D., Harvard Law School",
    "Licensed in New York & New Jersey",
    "15+ Years Experience",
    "Former Federal Prosecutor",
  ];

  const stats = [
    { icon: Scale, label: "Cases Won", value: "250+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Users, label: "Satisfied Clients", value: "500+" },
    { icon: BookOpen, label: "Published Articles", value: "25+" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-cream to-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-1 gap-12 items-center">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] sm:h-[350px] md:h-[500px]">
                <Image
                  src="https://i.imgur.com/Sr0VR0K.jpeg"
                  alt="M. John Abraham , Attorney"
                  fill
                  className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  About M. John Abraham 
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  With over 15 years of experience in corporate and employment
                  law, I have dedicated my career to providing exceptional legal
                  representation to businesses and individuals. My approach
                  combines deep legal expertise with practical business acumen
                  to deliver results that matter.
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  I believe in building lasting relationships with my clients
                  through transparent communication, strategic thinking, and
                  relentless advocacy. Every case receives my personal attention
                  and commitment to excellence.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#001f3f] mb-4">
                    Credentials & Experience
                  </h3>
                  {credentials.map((credential, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="mr-2 mb-2 px-3 py-1"
                    >
                      {credential}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <h4 className="text-4xl text-center font-bold text-[#001f3f] mb-8">
              Notable Achievements
            </h4>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="shadow-card hover:shadow-elegant transition-shadow duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                    <div className="text-3xl font-bold text-[#001f3f] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
