import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Wifi, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import doctorImage from "@/assets/doctor-hero.jpg";

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary-foreground"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Healthcare</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transforming Rural
              <span className="block">Healthcare with</span>
              <span className="relative">
                Artificial Intelligence
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-2 left-0 h-3 bg-accent/30 -z-10"
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
              Bridging the healthcare gap in rural India through AI evolution — from offline 
              rule-based diagnosis to advanced machine learning and telemedicine solutions.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button variant="hero" size="xl">
                Start Free Diagnosis
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: "500K+", label: "Patients Served" },
                { value: "98%", label: "Accuracy Rate" },
                { value: "1000+", label: "Villages Covered" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Doctor Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative lg:pl-8">
              <img
                src={doctorImage}
                alt="Healthcare professional providing AI-assisted diagnosis"
                className="rounded-3xl shadow-elevated w-full max-w-lg mx-auto"
              />
              
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute left-0 lg:-left-4 top-1/4 bg-background rounded-2xl p-4 shadow-elevated z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Offline Mode</div>
                    <div className="text-sm text-muted-foreground">Works without internet</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute right-0 lg:-right-4 bottom-1/4 bg-background rounded-2xl p-4 shadow-elevated z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Telemedicine</div>
                    <div className="text-sm text-muted-foreground">Connect with doctors</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};
