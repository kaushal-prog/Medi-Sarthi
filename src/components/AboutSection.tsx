import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import ruralImage from "@/assets/rural-healthcare.jpg";

const benefits = [
  "Early disease detection in remote areas",
  "Reduced dependency on urban hospitals",
  "Affordable healthcare for all",
  "Scalable AI-driven solutions",
  "Aligned with Digital India mission",
  "Privacy-first ethical approach",
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={ruralImage}
                alt="ASHA health worker providing care in rural India"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-8 -right-8 bg-card rounded-2xl p-6 shadow-elevated border border-border"
            >
              <div className="text-4xl font-bold text-primary mb-1">70%</div>
              <div className="text-muted-foreground">Rural Population Underserved</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Bridging the Healthcare Gap in
              <span className="text-gradient block">Rural India</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              In India, a large portion of the rural population faces serious challenges in 
              accessing quality healthcare. Rural areas suffer from a shortage of qualified 
              doctors, limited medical infrastructure, poor internet connectivity, and 
              delayed diagnosis of diseases.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our mission is to build an AI-powered rural healthcare platform that evolves 
              through stages — enabling early diagnosis, reducing hospital dependency, and 
              improving healthcare accessibility in underserved regions.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="accent" size="lg">
              Learn More About Our Mission
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
