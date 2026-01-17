import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  AlertTriangle, History, MessageSquare, Volume2, VolumeX,
  Send, Loader2, Stethoscope, Heart, Clock, X, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { 
  analyzeSymptoms, 
  generateDoctorResponse, 
  saveConsultation,
  getConsultationHistory,
  ConsultationRecord,
  SymptomAnalysis
} from '@/lib/symptomAnalyzer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const AIDoctor = () => {
  // Video states
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Chat states
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'doctor';
    content: string;
    timestamp: Date;
    isEmergency?: boolean;
  }>>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech states
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported: speechSupported } = useSpeechRecognition();
  const { isSpeaking, speak, stop: stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const [isMuted, setIsMuted] = useState(false);

  // History states
  const [consultationHistory, setConsultationHistory] = useState<ConsultationRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Emergency state
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [currentEmergency, setCurrentEmergency] = useState<SymptomAnalysis | null>(null);

  // Load history on mount
  useEffect(() => {
    setConsultationHistory(getConsultationHistory());
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Start video stream
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsVideoOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  // Stop video stream
  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoOn(false);
  };

  // Start consultation
  const startConsultation = async () => {
    await startVideo();
    setIsConsultationActive(true);
    setMessages([{
      role: 'doctor',
      content: 'Namaste! I am Dr. AI from Medi Sarthi. How may I help you today? Please describe your symptoms. You can type or use the microphone to speak.',
      timestamp: new Date()
    }]);
    
    if (!isMuted && ttsSupported) {
      speak('Namaste! I am Doctor AI from Medi Sarthi. How may I help you today? Please describe your symptoms.');
    }
    
    toast.success('Consultation started', {
      description: 'You can now describe your symptoms to the AI doctor.'
    });
  };

  // End consultation
  const endConsultation = () => {
    stopVideo();
    stopListening();
    stopSpeaking();
    setIsConsultationActive(false);
    setMessages([]);
    setInputText('');
    resetTranscript();
    toast.info('Consultation ended. Take care!');
  };

  // Process symptoms and get AI response
  const processSymptoms = useCallback(async (symptoms: string) => {
    if (!symptoms.trim()) return;

    setIsProcessing(true);
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: symptoms,
      timestamp: new Date()
    }]);

    // Analyze symptoms (rule-based, works offline)
    const analysis = analyzeSymptoms(symptoms);
    const response = generateDoctorResponse(analysis);

    // Check for emergency
    if (analysis.isEmergency) {
      setCurrentEmergency(analysis);
      setShowEmergencyAlert(true);
    }

    // Save to history
    saveConsultation({
      symptoms,
      analysis,
      response
    });
    setConsultationHistory(getConsultationHistory());

    // Add doctor response with slight delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMessages(prev => [...prev, {
      role: 'doctor',
      content: response,
      timestamp: new Date(),
      isEmergency: analysis.isEmergency
    }]);

    // Speak the response
    if (!isMuted && ttsSupported) {
      speak(response);
    }

    setIsProcessing(false);
    setInputText('');
    resetTranscript();
  }, [isMuted, ttsSupported, speak, resetTranscript]);

  // Handle send message
  const handleSend = () => {
    if (inputText.trim()) {
      processSymptoms(inputText);
    }
  };

  // Handle voice input toggle
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        processSymptoms(transcript);
      }
    } else {
      startListening();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section id="ai-doctor" className="py-24 gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <Stethoscope className="w-4 h-4" />
            AI Video Consultation
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Meet Your AI Doctor
            <span className="text-gradient block">24/7 Healthcare Support</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Describe your symptoms through voice or text. Our AI doctor will analyze 
            and provide guidance in simple language. Works even offline!
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {!isConsultationActive ? (
            // Pre-consultation view
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-3xl shadow-elevated p-8 text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full gradient-hero flex items-center justify-center">
                <Stethoscope className="w-16 h-16 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready for Your Consultation?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start a video consultation with our AI doctor. Your privacy is protected 
                and all data is stored locally on your device.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={startConsultation}
                  className="gap-2"
                >
                  <Video className="w-5 h-5" />
                  Start Video Consultation
                </Button>
                
                <Dialog open={showHistory} onOpenChange={setShowHistory}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2">
                      <History className="w-5 h-5" />
                      View History
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Consultation History
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      {consultationHistory.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No consultation history yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {consultationHistory.map((record) => (
                            <div 
                              key={record.id} 
                              className={`p-4 rounded-xl border ${
                                record.analysis.isEmergency 
                                  ? 'border-destructive bg-destructive/5' 
                                  : 'border-border bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {new Date(record.timestamp).toLocaleString('en-IN')}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  record.analysis.severity === 'emergency' ? 'bg-destructive text-destructive-foreground' :
                                  record.analysis.severity === 'high' ? 'bg-orange-500 text-white' :
                                  record.analysis.severity === 'medium' ? 'bg-yellow-500 text-black' :
                                  'bg-green-500 text-white'
                                }`}>
                                  {record.analysis.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className="font-medium text-foreground mb-1">
                                {record.analysis.condition}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Symptoms: {record.symptoms.slice(0, 100)}...
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-left">
                {[
                  { icon: Video, title: 'Video Call', desc: 'Face-to-face consultation' },
                  { icon: Mic, title: 'Voice Input', desc: 'Speak your symptoms' },
                  { icon: Heart, title: 'Offline Mode', desc: 'Works without internet' }
                ].map((feature, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <feature.icon className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Active consultation view
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Video Panel */}
              <div className="bg-background rounded-3xl shadow-elevated overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Camera Off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Doctor overlay */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Dr. AI</p>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Active
                      </p>
                    </div>
                  </div>

                  {/* Speaking indicator */}
                  <AnimatePresence>
                    {isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-4 right-4 bg-primary/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3"
                      >
                        <Volume2 className="w-5 h-5 text-primary-foreground animate-pulse" />
                        <span className="text-primary-foreground text-sm">Doctor is speaking...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Video controls */}
                <div className="p-4 flex justify-center gap-4">
                  <Button
                    variant={isVideoOn ? "outline" : "destructive"}
                    size="icon"
                    onClick={isVideoOn ? stopVideo : startVideo}
                    className="rounded-full w-12 h-12"
                  >
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={isMuted ? "destructive" : "outline"}
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full w-12 h-12"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={endConsultation}
                    className="rounded-full w-12 h-12"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Panel */}
              <div className="bg-background rounded-3xl shadow-elevated flex flex-col h-[500px] lg:h-auto">
                {/* Chat header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Consultation Chat</span>
                  </div>
                  {isListening && (
                    <span className="text-sm text-red-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Listening...
                    </span>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl p-4 ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : msg.isEmergency 
                              ? 'bg-destructive/10 border-2 border-destructive text-foreground'
                              : 'bg-muted text-foreground'
                        }`}>
                          {msg.isEmergency && (
                            <div className="flex items-center gap-2 text-destructive font-bold mb-2">
                              <AlertTriangle className="w-5 h-5" />
                              EMERGENCY DETECTED
                            </div>
                          )}
                          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                          <p className={`text-xs mt-2 ${
                            msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl p-4 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Analyzing symptoms...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input area */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Describe your symptoms..."
                      className="min-h-[44px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={toggleVoiceInput}
                        disabled={!speechSupported}
                        title={speechSupported ? "Voice input" : "Voice not supported"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!inputText.trim() || isProcessing}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Emergency Alert Dialog */}
        <AnimatePresence>
          {showEmergencyAlert && currentEmergency && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowEmergencyAlert(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-background rounded-2xl p-6 max-w-md w-full border-4 border-destructive shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-destructive mb-2">
                    Medical Emergency!
                  </h3>
                  <p className="text-foreground mb-4">
                    {currentEmergency.emergencyMessage}
                  </p>
                  <div className="bg-destructive/10 rounded-xl p-4 mb-6 text-left">
                    <p className="font-semibold text-foreground mb-2">Immediate Steps:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {currentEmergency.precautions.slice(0, 3).map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="destructive" 
                      className="flex-1 gap-2"
                      onClick={() => window.open('tel:108')}
                    >
                      <Phone className="w-4 h-4" />
                      Call 108
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowEmergencyAlert(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
