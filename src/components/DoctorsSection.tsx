import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctorHero from "@/assets/doctor-hero.jpg";

const doctors = [
  {
    name: "Dr. Rajesh Kumar",
    specialty: "General Medicine",
    experience: "15+ years",
    rating: 4.9,
    image: doctor1,
    available: true,
  },
  {
    name: "Dr. Fatima Ahmed",
    specialty: "Pediatrics",
    experience: "12+ years",
    rating: 4.8,
    image: doctor2,
    available: true,
  },
  {
    name: "Dr. Anil Sharma",
    specialty: "Cardiology",
    experience: "10+ years",
    rating: 4.9,
    image: doctor3,
    available: false,
  },
  {
    name: "Dr. Priya Patel",
    specialty: "Gynecology",
    experience: "8+ years",
    rating: 4.7,
    image: doctorHero,
    available: true,
  },
];

const DoctorCard = ({ doctor, index }: { doctor: typeof doctors[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border group-hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {doctor.available && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Available Now
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-1">{doctor.name}</h3>
          <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">{doctor.experience}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{doctor.rating}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default" size="sm" className="flex-1">
              <Video className="w-4 h-4" />
              Consult
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Calendar className="w-4 h-4" />
              Book
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const DoctorsSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="doctors" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Doctors
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Expert Healthcare
            <span className="text-gradient block">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with qualified doctors through our telemedicine platform 
            for consultations from anywhere.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.name} doctor={doctor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
