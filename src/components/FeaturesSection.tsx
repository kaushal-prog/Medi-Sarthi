import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Stethoscope, 
  Users, 
  Video, 
  BarChart3, 
  Mic, 
  WifiOff, 
  Brain, 
  Heart,
  LucideIcon
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  actionType: 'scroll' | 'toast' | 'navigate';
  toastMessage?: string;
  scrollTarget?: string;
}

const features: Feature[] = [
  {
    icon: WifiOff,
    title: "Offline Diagnosis",
    description: "Rule-based symptom checker that works without internet connectivity in remote areas.",
    action: "symptom-checker",
    actionType: "scroll",
    scrollTarget: "symptom-checker",
    toastMessage: "Our offline diagnosis uses advanced rule-based algorithms to analyze symptoms without requiring internet connectivity.",
  },
  {
    icon: Brain,
    title: "ML Predictions",
    description: "Advanced machine learning models for accurate disease prediction and risk assessment.",
    action: "ml-predictions",
    actionType: "toast",
    toastMessage: "Our ML models analyze your symptoms using trained datasets to provide accurate disease predictions with confidence scores.",
  },
  {
    icon: Video,
    title: "Telemedicine",
    description: "Connect with qualified doctors through video consultations from any location.",
    action: "doctors",
    actionType: "scroll",
    scrollTarget: "doctors",
    toastMessage: "Connect with our network of qualified doctors for video consultations.",
  },
  {
    icon: Mic,
    title: "Voice Interface",
    description: "Multilingual voice-based interaction for easy accessibility in local languages.",
    action: "voice",
    actionType: "toast",
    toastMessage: "Voice interface supports Hindi, Marathi, Tamil, Telugu and 10+ regional languages. Just speak your symptoms naturally!",
  },
  {
    icon: Stethoscope,
    title: "Health Monitoring",
    description: "Integration with wearable devices for continuous health tracking and alerts.",
    action: "monitoring",
    actionType: "toast",
    toastMessage: "Connect your smartwatch or fitness band to continuously monitor heart rate, SpO2, and other vital signs with instant alerts.",
  },
  {
    icon: Users,
    title: "ASHA Support",
    description: "Tools for health workers to register patients and capture vitals efficiently.",
    action: "asha",
    actionType: "toast",
    toastMessage: "ASHA workers can register patients, record vitals, and sync data when internet is available. Special training modules included.",
  },
  {
    icon: Heart,
    title: "Maternal Care",
    description: "Specialized modules for pregnancy tracking and maternal health support.",
    action: "maternal",
    actionType: "toast",
    toastMessage: "Track pregnancy milestones, receive personalized nutrition advice, and get reminders for prenatal checkups and vaccinations.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "District-wise health analytics and outbreak prediction for government bodies.",
    action: "analytics",
    actionType: "toast",
    toastMessage: "Real-time dashboards showing disease patterns, outbreak predictions, and resource allocation recommendations for health departments.",
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleClick = () => {
    if (feature.actionType === 'scroll' && feature.scrollTarget) {
      const element = document.getElementById(feature.scrollTarget);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        toast.info(feature.title, {
          description: feature.toastMessage,
          duration: 5000,
        });
      }
    } else if (feature.actionType === 'toast') {
      toast.info(feature.title, {
        description: feature.toastMessage,
        duration: 5000,
      });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className="group gradient-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 border border-border cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <feature.icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
      <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Click to learn more →
      </div>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="features" className="py-24 gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Healthcare
            <span className="text-gradient block">At Your Fingertips</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform brings world-class healthcare to rural communities 
            with features designed for accessibility and reliability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
