// Rule-based symptom analyzer for offline/low-internet mode
// This provides basic medical guidance without requiring API calls

export interface SymptomAnalysis {
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  guidance: string;
  precautions: string[];
  whenToSeekHelp: string;
  isEmergency: boolean;
  emergencyMessage?: string;
}

// Emergency keywords that require immediate attention
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'can\'t breathe', 'difficulty breathing',
  'unconscious', 'unresponsive', 'severe bleeding', 'stroke', 'paralysis',
  'seizure', 'convulsion', 'poisoning', 'overdose', 'suicidal', 'severe burn',
  'head injury', 'drowning', 'choking', 'anaphylaxis', 'allergic reaction severe'
];

// Symptom to condition mapping with responses
const SYMPTOM_DATABASE: Record<string, SymptomAnalysis> = {
  'fever': {
    condition: 'Fever / Viral Infection',
    severity: 'medium',
    guidance: 'You seem to have fever. This is often caused by viral infections. Please take adequate rest and stay hydrated.',
    precautions: [
      'Drink plenty of fluids - water, ORS, coconut water',
      'Take paracetamol (500mg) for fever above 100°F',
      'Use a cool damp cloth on forehead',
      'Eat light, easily digestible food',
      'Take complete bed rest'
    ],
    whenToSeekHelp: 'If fever persists beyond 3 days, exceeds 103°F, or is accompanied by severe headache, rash, or difficulty breathing.',
    isEmergency: false
  },
  'cold': {
    condition: 'Common Cold',
    severity: 'low',
    guidance: 'You appear to have a common cold. This is usually self-limiting and will improve in 5-7 days.',
    precautions: [
      'Steam inhalation 2-3 times daily',
      'Warm water with honey and ginger',
      'Gargle with warm salt water',
      'Avoid cold drinks and ice cream',
      'Get adequate sleep'
    ],
    whenToSeekHelp: 'If symptoms worsen, fever develops, or you experience breathing difficulty.',
    isEmergency: false
  },
  'cough': {
    condition: 'Cough / Respiratory Infection',
    severity: 'low',
    guidance: 'Cough is your body\'s way of clearing the airways. Let me suggest some remedies.',
    precautions: [
      'Honey with warm water provides relief',
      'Steam inhalation helps loosen mucus',
      'Avoid dust and smoke exposure',
      'Keep yourself warm',
      'Stay hydrated'
    ],
    whenToSeekHelp: 'If cough persists beyond 2 weeks, produces blood, or is accompanied by high fever and chest pain.',
    isEmergency: false
  },
  'headache': {
    condition: 'Headache / Tension Headache',
    severity: 'low',
    guidance: 'Headaches are common and usually not serious. Let me help you manage it.',
    precautions: [
      'Rest in a quiet, dark room',
      'Apply cold compress to forehead',
      'Take paracetamol if needed',
      'Stay hydrated',
      'Reduce screen time'
    ],
    whenToSeekHelp: 'If headache is sudden and severe, accompanied by vision changes, stiff neck, or confusion.',
    isEmergency: false
  },
  'stomach pain': {
    condition: 'Abdominal Pain / Gastric Issue',
    severity: 'medium',
    guidance: 'Stomach pain can have various causes. Let me suggest some initial measures.',
    precautions: [
      'Avoid spicy and oily food',
      'Eat small, frequent meals',
      'Take antacid if gastric in nature',
      'Stay hydrated with ORS',
      'Apply warm compress if cramps'
    ],
    whenToSeekHelp: 'If pain is severe, persistent, or accompanied by blood in stool, vomiting blood, or high fever.',
    isEmergency: false
  },
  'diarrhea': {
    condition: 'Diarrhea / Gastroenteritis',
    severity: 'medium',
    guidance: 'Diarrhea leads to dehydration. The most important thing is to replace lost fluids.',
    precautions: [
      'Drink ORS after every loose motion',
      'Continue breastfeeding for infants',
      'Eat easily digestible food like khichdi',
      'Avoid milk and dairy products',
      'Maintain hygiene - wash hands frequently'
    ],
    whenToSeekHelp: 'If you notice blood in stool, high fever, signs of severe dehydration, or symptoms persist beyond 2 days.',
    isEmergency: false
  },
  'vomiting': {
    condition: 'Vomiting / Nausea',
    severity: 'medium',
    guidance: 'Vomiting can lead to dehydration. Let\'s focus on keeping you hydrated.',
    precautions: [
      'Take small sips of water frequently',
      'Try ginger tea for nausea',
      'Avoid solid food until vomiting stops',
      'Rest in a propped up position',
      'Start ORS once vomiting reduces'
    ],
    whenToSeekHelp: 'If vomiting blood, severe abdominal pain, signs of dehydration, or vomiting persists beyond 24 hours.',
    isEmergency: false
  },
  'body pain': {
    condition: 'Body Ache / Myalgia',
    severity: 'low',
    guidance: 'Body pain is often associated with viral infections or physical strain.',
    precautions: [
      'Take adequate rest',
      'Gentle massage with warm oil',
      'Paracetamol for pain relief',
      'Stay hydrated',
      'Warm compress on affected areas'
    ],
    whenToSeekHelp: 'If accompanied by high fever, rash, severe weakness, or pain is localized and severe.',
    isEmergency: false
  },
  'skin rash': {
    condition: 'Skin Rash / Allergic Reaction',
    severity: 'medium',
    guidance: 'Skin rashes can be due to allergies or infections. Let me guide you.',
    precautions: [
      'Avoid scratching the affected area',
      'Apply calamine lotion for itching',
      'Wear loose cotton clothes',
      'Identify and avoid potential allergens',
      'Take antihistamine if allergic'
    ],
    whenToSeekHelp: 'If rash spreads rapidly, is accompanied by breathing difficulty, swelling, or fever.',
    isEmergency: false
  },
  'weakness': {
    condition: 'General Weakness / Fatigue',
    severity: 'low',
    guidance: 'Feeling weak can be due to various reasons including inadequate nutrition or illness.',
    precautions: [
      'Ensure adequate sleep and rest',
      'Eat nutritious, balanced meals',
      'Stay hydrated',
      'Light exercise when feeling better',
      'Check for anemia if persistent'
    ],
    whenToSeekHelp: 'If weakness is sudden, severe, or accompanied by other symptoms like chest pain or confusion.',
    isEmergency: false
  },
  'diabetes': {
    condition: 'Diabetes Management Query',
    severity: 'medium',
    guidance: 'Managing diabetes requires consistent attention to diet, medication, and lifestyle.',
    precautions: [
      'Monitor blood sugar regularly',
      'Take medications as prescribed',
      'Follow a low-sugar, balanced diet',
      'Regular physical activity',
      'Regular check-ups for complications'
    ],
    whenToSeekHelp: 'If blood sugar is very high or low, symptoms of diabetic emergency, or wounds that don\'t heal.',
    isEmergency: false
  },
  'blood pressure': {
    condition: 'Blood Pressure Concern',
    severity: 'medium',
    guidance: 'Blood pressure management is important for heart health.',
    precautions: [
      'Reduce salt intake',
      'Take prescribed medications regularly',
      'Regular monitoring at home',
      'Maintain healthy weight',
      'Avoid stress, practice relaxation'
    ],
    whenToSeekHelp: 'If BP is very high (above 180/120), severe headache, chest pain, or vision changes.',
    isEmergency: false
  }
};

export const analyzeSymptoms = (input: string): SymptomAnalysis => {
  const lowerInput = input.toLowerCase();
  
  // Check for emergency keywords first
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (lowerInput.includes(keyword)) {
      return {
        condition: 'Medical Emergency Detected',
        severity: 'emergency',
        guidance: 'This appears to be a medical emergency requiring immediate attention.',
        precautions: [
          'Call emergency services immediately (108 or 102)',
          'Do not delay seeking hospital care',
          'Keep the patient calm and comfortable',
          'Do not give any food or water',
          'Note down the symptoms and time of onset'
        ],
        whenToSeekHelp: 'IMMEDIATELY - Please go to the nearest hospital or call emergency services right now.',
        isEmergency: true,
        emergencyMessage: `⚠️ EMERGENCY ALERT: Symptoms like \"${keyword}\" require immediate medical attention. Please visit the nearest hospital immediately or call 108 for ambulance. Do not delay!`
      };
    }
  }
  
  // Check for known symptoms
  for (const [symptom, analysis] of Object.entries(SYMPTOM_DATABASE)) {
    if (lowerInput.includes(symptom)) {
      return analysis;
    }
  }
  
  // Default response for unrecognized symptoms
  return {
    condition: 'General Health Concern',
    severity: 'low',
    guidance: 'I understand you\'re not feeling well. While I couldn\'t identify a specific condition, let me provide general guidance.',
    precautions: [
      'Take adequate rest',
      'Stay hydrated with water and fluids',
      'Eat light, nutritious food',
      'Monitor your symptoms',
      'Maintain hygiene and cleanliness'
    ],
    whenToSeekHelp: 'If symptoms persist beyond 2-3 days, worsen, or you develop new symptoms like high fever or severe pain.',
    isEmergency: false
  };
};

export const generateDoctorResponse = (analysis: SymptomAnalysis): string => {
  const disclaimer = "\n\nDisclaimer: This is AI-assisted guidance and not a substitute for professional medical consultation. Please consult a qualified doctor for proper diagnosis and treatment.";
  
  if (analysis.isEmergency) {
    return `🚨 ${analysis.emergencyMessage}\n\n${analysis.guidance}\n\nImmediate Steps:\n${analysis.precautions.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n${disclaimer}`;
  }
  
  return `Namaste, I am Dr. AI from Medi Sarthi. I've listened to your symptoms carefully.\n\nBased on what you've described, this appears to be: ${analysis.condition}\n\n${analysis.guidance}\n\nHere's what I recommend:\n${analysis.precautions.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nWhen to visit a doctor: ${analysis.whenToSeekHelp}\n\n${disclaimer}`;
};

// Store consultation history locally
export interface ConsultationRecord {
  id: string;
  timestamp: Date;
  symptoms: string;
  analysis: SymptomAnalysis;
  response: string;
}

export const saveConsultation = (record: Omit<ConsultationRecord, 'id' | 'timestamp'>): ConsultationRecord => {
  const newRecord: ConsultationRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: new Date()
  };
  
  const history = getConsultationHistory();
  history.unshift(newRecord);
  
  // Keep only last 50 records
  const trimmedHistory = history.slice(0, 50);
  localStorage.setItem('medi_sarthi_history', JSON.stringify(trimmedHistory));
  
  return newRecord;
};

export const getConsultationHistory = (): ConsultationRecord[] => {
  try {
    const stored = localStorage.getItem('medi_sarthi_history');
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    return history.map((record: any) => ({
      ...record,
      timestamp: new Date(record.timestamp)
    }));
  } catch {
    return [];
  }
};

export const clearConsultationHistory = (): void => {
  localStorage.removeItem('medi_sarthi_history');
};
