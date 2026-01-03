import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Stethoscope, UserCog, Building2 } from "lucide-react";

const departments = [
  {
    icon: Users,
    title: "Patient Module",
    description: "Multilingual interface with offline symptom checker, AI predictions, and health tracking.",
    features: ["Voice interface", "Health score", "Medication reminders", "Wearable integration"],
  },
  {
    icon: Stethoscope,
    title: "Health Worker (ASHA)",
    description: "Tools for frontline workers to register patients and provide community care.",
    features: ["Offline registration", "Vitals capture", "AI-assisted triage", "Follow-up tracking"],
  },
  {
    icon: UserCog,
    title: "Doctor Module",
    description: "AI-generated summaries and remote consultation tools for healthcare professionals.",
    features: ["Pre-diagnosis reports", "Video consultation", "Prescription management", "Remote monitoring"],
  },
  {
    icon: Building2,
    title: "Admin Dashboard",
    description: "Analytics and planning tools for government health departments.",
    features: ["District analytics", "Outbreak prediction", "Resource planning", "Performance metrics"],
  },
];

const DepartmentCard = ({ department, index }: { department: typeof departments[0]; index: number }) => {
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
      <div className="bg-card rounded-3xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border h-full group-hover:-translate-y-2">
        <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <department.icon className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-3">{department.title}</h3>
        <p className="text-muted-foreground mb-6">{department.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {department.features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const DepartmentsSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="departments" className="py-24 gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Our Departments
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Modules for Every
            <span className="text-gradient block">Healthcare Stakeholder</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive solutions tailored for patients, health workers, doctors, 
            and government administrators.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((department, index) => (
            <DepartmentCard key={department.title} department={department} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
