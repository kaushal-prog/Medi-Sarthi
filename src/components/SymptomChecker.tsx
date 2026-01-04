import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const symptoms = [
  { id: "fever", label: "Fever", category: "general" },
  { id: "cough", label: "Cough", category: "respiratory" },
  { id: "headache", label: "Headache", category: "general" },
  { id: "fatigue", label: "Fatigue", category: "general" },
  { id: "body_pain", label: "Body Pain", category: "general" },
  { id: "breathing", label: "Breathing Difficulty", category: "respiratory" },
  { id: "chest_pain", label: "Chest Pain", category: "cardiac" },
  { id: "nausea", label: "Nausea/Vomiting", category: "digestive" },
  { id: "diarrhea", label: "Diarrhea", category: "digestive" },
  { id: "cold", label: "Cold/Runny Nose", category: "respiratory" },
  { id: "sore_throat", label: "Sore Throat", category: "respiratory" },
  { id: "dizziness", label: "Dizziness", category: "general" },
  { id: "joint_pain", label: "Joint Pain", category: "musculoskeletal" },
  { id: "skin_rash", label: "Skin Rash", category: "skin" },
  { id: "abdominal_pain", label: "Abdominal Pain", category: "digestive" },
  { id: "loss_appetite", label: "Loss of Appetite", category: "general" },
  { id: "chills", label: "Chills/Sweating", category: "general" },
  { id: "muscle_weakness", label: "Muscle Weakness", category: "musculoskeletal" },
  { id: "back_pain", label: "Back Pain", category: "musculoskeletal" },
  { id: "eye_irritation", label: "Eye Irritation", category: "sensory" },
  { id: "ear_pain", label: "Ear Pain", category: "sensory" },
  { id: "urination_pain", label: "Painful Urination", category: "urinary" },
  { id: "swelling", label: "Swelling", category: "general" },
  { id: "palpitations", label: "Heart Palpitations", category: "cardiac" },
  { id: "anxiety", label: "Anxiety", category: "mental" },
  { id: "insomnia", label: "Insomnia", category: "mental" },
  { id: "weight_loss", label: "Unexplained Weight Loss", category: "general" },
  { id: "night_sweats", label: "Night Sweats", category: "general" },
];

const diagnoses: Record<string, { condition: string; severity: string; advice: string; color: string }> = {
  "fever,cough,cold": {
    condition: "Common Cold / Flu",
    severity: "Mild",
    advice: "Rest, stay hydrated, take paracetamol for fever. Consult a doctor if symptoms persist beyond 5 days.",
    color: "text-amber-600",
  },
  "fever,headache,body_pain": {
    condition: "Viral Fever",
    severity: "Mild to Moderate",
    advice: "Take rest, drink plenty of fluids, use paracetamol. Seek medical attention if fever exceeds 103°F.",
    color: "text-amber-600",
  },
  "fever,cough,breathing": {
    condition: "Respiratory Infection (Possible)",
    severity: "Moderate",
    advice: "Seek medical consultation soon. This could indicate pneumonia or other respiratory conditions.",
    color: "text-orange-600",
  },
  "chest_pain,breathing": {
    condition: "Cardiac Concern",
    severity: "High",
    advice: "Seek immediate medical attention. Do not ignore chest pain with breathing difficulty.",
    color: "text-destructive",
  },
  "nausea,diarrhea": {
    condition: "Gastroenteritis",
    severity: "Mild to Moderate",
    advice: "Stay hydrated with ORS. Avoid spicy/oily food. Consult doctor if symptoms persist over 48 hours.",
    color: "text-amber-600",
  },
  "joint_pain,fever,chills": {
    condition: "Dengue / Chikungunya (Possible)",
    severity: "Moderate to High",
    advice: "Seek medical attention immediately. Monitor platelet count and stay hydrated. Avoid self-medication.",
    color: "text-orange-600",
  },
  "skin_rash,fever,joint_pain": {
    condition: "Viral Exanthem / Allergic Reaction",
    severity: "Moderate",
    advice: "Consult a dermatologist or physician. Avoid scratching and keep the area clean.",
    color: "text-amber-600",
  },
  "abdominal_pain,nausea,loss_appetite": {
    condition: "Gastritis / Digestive Issue",
    severity: "Mild to Moderate",
    advice: "Eat light meals, avoid spicy food. Take antacids if needed. See a doctor if pain is severe.",
    color: "text-amber-600",
  },
  "back_pain,muscle_weakness": {
    condition: "Musculoskeletal Strain",
    severity: "Mild",
    advice: "Rest, apply heat/cold packs. Consider physiotherapy if pain persists beyond a week.",
    color: "text-primary",
  },
  "urination_pain,fever,abdominal_pain": {
    condition: "Urinary Tract Infection (UTI)",
    severity: "Moderate",
    advice: "Drink plenty of water. See a doctor for antibiotics. Do not delay treatment.",
    color: "text-orange-600",
  },
  "palpitations,anxiety,insomnia": {
    condition: "Anxiety / Stress Disorder",
    severity: "Mild to Moderate",
    advice: "Practice relaxation techniques. Consider counseling. Seek help if symptoms affect daily life.",
    color: "text-amber-600",
  },
  "weight_loss,night_sweats,fatigue": {
    condition: "Chronic Condition (Requires Evaluation)",
    severity: "High",
    advice: "These symptoms require thorough medical evaluation. Please consult a doctor immediately.",
    color: "text-destructive",
  },
  "ear_pain,fever,headache": {
    condition: "Ear Infection (Otitis)",
    severity: "Mild to Moderate",
    advice: "Keep ear dry. Take pain relievers. See an ENT specialist if symptoms persist.",
    color: "text-amber-600",
  },
  "eye_irritation,headache": {
    condition: "Eye Strain / Conjunctivitis",
    severity: "Mild",
    advice: "Rest your eyes, avoid screens. Use lubricating eye drops. Consult if redness persists.",
    color: "text-primary",
  },
  "swelling,joint_pain,fatigue": {
    condition: "Inflammatory Condition",
    severity: "Moderate",
    advice: "Could indicate arthritis or autoimmune condition. Medical evaluation recommended.",
    color: "text-orange-600",
  },
};

export const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<typeof diagnoses[string] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    );
    setResult(null);
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const sortedSymptoms = [...selectedSymptoms].sort().join(",");
      
      // Check for matches
      let matchedDiagnosis = null;
      for (const [key, value] of Object.entries(diagnoses)) {
        const keySymptoms = key.split(",");
        const matchCount = keySymptoms.filter((s) => selectedSymptoms.includes(s)).length;
        if (matchCount >= 2) {
          matchedDiagnosis = value;
          break;
        }
      }

      if (!matchedDiagnosis) {
        matchedDiagnosis = {
          condition: "General Health Check Required",
          severity: "Low",
          advice: "Based on your symptoms, we recommend a general health consultation for proper diagnosis.",
          color: "text-primary",
        };
      }

      setResult(matchedDiagnosis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  return (
    <section className="py-24 gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              AI Symptom Checker
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Check Your Symptoms
              <span className="text-gradient block">Get Instant Guidance</span>
            </h2>
            <p className="text-muted-foreground">
              Select your symptoms below. Our rule-based AI will provide initial guidance.
              <br />
              <span className="text-sm text-muted-foreground/80">
                This works offline and is not a replacement for professional medical advice.
              </span>
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            {/* Symptoms Grid */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-4">Select your symptoms:</h3>
              <div className="flex flex-wrap gap-3">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      selectedSymptoms.includes(symptom.id)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {symptom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                variant="accent"
                size="lg"
                onClick={analyzeSymptoms}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={reset}>
                Reset
              </Button>
            </div>

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/50 rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  {result.severity === "High" ? (
                    <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-xl font-bold mb-1 ${result.color}`}>
                      {result.condition}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Severity: <span className="font-medium">{result.severity}</span>
                    </p>
                    <p className="text-foreground">{result.advice}</p>
                    
                    <div className="mt-4 p-4 bg-primary/5 rounded-xl">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This is a rule-based preliminary assessment. 
                        For accurate diagnosis, please consult a healthcare professional.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
