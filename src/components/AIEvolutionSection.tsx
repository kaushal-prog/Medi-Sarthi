import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Settings, Cpu, Sparkles, ArrowRight } from "lucide-react";

const stages = [
  {
    stage: "Stage 1",
    title: "Rule-Based AI",
    subtitle: "Offline Diagnosis",
    icon: Settings,
    color: "from-amber-500 to-orange-500",
    features: [
      "Predefined medical rules",
      "Works completely offline",
      "Basic symptom analysis",
      "First-level screening",
      "No internet required",
    ],
    description: "Uses traditional medical knowledge encoded as rules to provide basic health guidance even in areas without connectivity.",
  },
  {
    stage: "Stage 2",
    title: "Machine Learning AI",
    subtitle: "Predictive Analytics",
    icon: Cpu,
    color: "from-primary to-teal-500",
    features: [
      "Logistic Regression & Random Forest",
      "XGBoost & Neural Networks",
      "Diabetes & Heart Disease prediction",
      "TB, Malaria & Anemia detection",
      "Probability-based risk scores",
    ],
    description: "Advanced algorithms trained on medical datasets to predict diseases with high accuracy and provide personalized risk assessments.",
  },
  {
    stage: "Stage 3",
    title: "Advanced AI",
    subtitle: "Next-Gen Healthcare",
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
    features: [
      "NLP voice assistants",
      "Computer vision for imaging",
      "Outbreak forecasting",
      "Federated learning",
      "Privacy-preserving models",
    ],
    description: "Cutting-edge AI technologies including natural language processing, medical image analysis, and predictive epidemiology.",
  },
];

const StageCard = ({ stage, index }: { stage: typeof stages[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative group"
    >
      {/* Connector Line */}
      {index < stages.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-y-1/2 z-0">
          <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        </div>
      )}

      <div className="relative bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 border border-border group-hover:-translate-y-2">
        {/* Stage Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${stage.color} text-accent-foreground text-sm font-semibold mb-6`}>
          <stage.icon className="w-4 h-4" />
          {stage.stage}
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2">{stage.title}</h3>
        <p className="text-primary font-medium mb-4">{stage.subtitle}</p>
        <p className="text-muted-foreground mb-6">{stage.description}</p>

        <ul className="space-y-3">
          {stage.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-foreground">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stage.color}`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const AIEvolutionSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="ai-evolution" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            AI Evolution
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Journey of
            <span className="text-gradient block">AI in Healthcare</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform demonstrates the evolution of AI from simple rule-based systems 
            to sophisticated machine learning and advanced AI technologies.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
          {stages.map((stage, index) => (
            <StageCard key={stage.title} stage={stage} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
