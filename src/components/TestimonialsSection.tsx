import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sunita Devi",
    role: "Village Resident, Bihar",
    content: "The offline symptom checker helped me understand my condition when there was no doctor nearby. It guided me to seek help immediately, which saved my life.",
    rating: 5,
  },
  {
    name: "Dr. Mahesh Verma",
    role: "District Medical Officer",
    content: "RuralCare AI has transformed how we deliver healthcare in our district. The AI predictions are remarkably accurate and help us prioritize critical cases.",
    rating: 5,
  },
  {
    name: "Rekha Sharma",
    role: "ASHA Health Worker",
    content: "The app makes my job so much easier. I can register patients, track their vitals, and get AI-assisted triage even in areas with poor connectivity.",
    rating: 5,
  },
  {
    name: "Ramesh Yadav",
    role: "Patient, Rajasthan",
    content: "I consulted a cardiologist through telemedicine and got proper treatment without traveling 100km to the city. This is truly revolutionary for villages.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-medium text-sm mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            What People Say
            <span className="block opacity-80">About RuralCare AI</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-background rounded-3xl p-8 md:p-12 shadow-elevated"
          >
            <Quote className="w-12 h-12 text-primary/20 mb-6" />
            
            <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
              "{testimonials[currentIndex].content}"
            </p>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>

              <div className="flex gap-1">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary-foreground w-8"
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
