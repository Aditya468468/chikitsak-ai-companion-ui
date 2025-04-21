"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Mic, Plus, X, AlertTriangle, Loader2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BACKEND_URL = "https://chikitsak-backend.onrender.com/";

// Complete list of symptoms with severity indicators
const SYMPTOM_DATABASE = [
  { name: "fever", severityLevel: "moderate" },
  { name: "cough", severityLevel: "mild" },
  { name: "headache", severityLevel: "mild" },
  { name: "sore throat", severityLevel: "mild" },
  { name: "runny nose", severityLevel: "mild" },
  { name: "chest pain", severityLevel: "emergency" },
  { name: "shortness of breath", severityLevel: "emergency" },
  { name: "seizure", severityLevel: "emergency" },
  { name: "unconsciousness", severityLevel: "emergency" },
  { name: "fatigue", severityLevel: "mild" },
  { name: "nausea", severityLevel: "moderate" },
  { name: "vomiting", severityLevel: "moderate" },
  { name: "diarrhea", severityLevel: "moderate" },
  { name: "dizziness", severityLevel: "moderate" },
  { name: "rash", severityLevel: "mild" },
  { name: "muscle pain", severityLevel: "mild" },
  { name: "joint pain", severityLevel: "moderate" },
  { name: "abdominal pain", severityLevel: "moderate" },
  { name: "back pain", severityLevel: "mild" },
  { name: "chills", severityLevel: "mild" },
  { name: "swelling", severityLevel: "moderate" },
  { name: "numbness", severityLevel: "moderate" },
  { name: "bleeding", severityLevel: "severe" },
  { name: "loss of consciousness", severityLevel: "emergency" },
  { name: "confusion", severityLevel: "severe" },
  { name: "difficulty speaking", severityLevel: "emergency" },
  { name: "difficulty breathing", severityLevel: "emergency" },
];

// Emergency symptoms that require immediate attention
const EMERGENCY_SYMPTOMS = [
  "chest pain",
  "shortness of breath",
  "seizure",
  "unconsciousness",
  "loss of consciousness",
  "difficulty breathing",
  "difficulty speaking",
  "severe bleeding",
];

interface Symptom {
  name: string;
  severityLevel?: string;
}

interface SymptomResponse {
  disease: string;
  matches: number;
  description?: string;
}

const SymptomChecker: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState("");
  const [suggestedSymptoms, setSuggestedSymptoms] = useState<Symptom[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState("moderate");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<SymptomResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (symptomInput.trim().length > 1) {
      const filtered = SYMPTOM_DATABASE.filter(
        (s) => 
          s.name.toLowerCase().includes(symptomInput.toLowerCase()) && 
          !symptoms.some(existing => existing.name === s.name)
      ).slice(0, 5);
      setSuggestedSymptoms(filtered);
    } else {
      setSuggestedSymptoms([]);
    }
  }, [symptomInput, symptoms]);

  // Check for emergency symptoms
  useEffect(() => {
    const hasEmergencySymptom = symptoms.some(s => 
      EMERGENCY_SYMPTOMS.includes(s.name.toLowerCase())
    );
    setIsEmergency(hasEmergencySymptom);
    
    if (hasEmergencySymptom) {
      setResult("⚠️ Emergency medical condition detected. Please seek immediate medical attention or call emergency services.");
      setDiagnosis(null);
    }
  }, [symptoms]);

  const addSymptom = (symptomName: string = symptomInput.trim()) => {
    if (!symptomName) return;
    
    // Find from database to get severity level
    const symptomInfo = SYMPTOM_DATABASE.find(s => 
      s.name.toLowerCase() === symptomName.toLowerCase()
    ) || { name: symptomName };
    
    if (!symptoms.some(s => s.name.toLowerCase() === symptomName.toLowerCase())) {
      setSymptoms([...symptoms, symptomInfo]);
      setSymptomInput("");
      setSuggestedSymptoms([]);
      
      // Focus back on input after adding
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const removeSymptom = (index: number) => {
    const newSymptoms = [...symptoms];
    newSymptoms.splice(index, 1);
    setSymptoms(newSymptoms);
    
    // Clear emergency alert if no emergency symptoms remain
    if (isEmergency && !newSymptoms.some(s => EMERGENCY_SYMPTOMS.includes(s.name.toLowerCase()))) {
      setIsEmergency(false);
      setResult(null);
    }
  };

  const extractSymptoms = (text: string) => {
    const detected: Symptom[] = [];
    const lowerText = text.toLowerCase();

    // More sophisticated symptom detection
    SYMPTOM_DATABASE.forEach((symptom) => {
      if (
        lowerText.includes(symptom.name.toLowerCase()) &&
        !symptoms.find((s) => s.name === symptom.name)
      ) {
        detected.push(symptom);
      }
    });

    if (detected.length > 0) {
      setSymptoms((prev) => [...prev, ...detected]);
      return `Detected symptoms: ${detected.map(s => s.name).join(', ')}`;
    }
    
    return "No known symptoms detected. Please try again or add symptoms manually.";
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech Recognition API not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const result = extractSymptoms(transcript);
        setError(result);  // Use error state to show the result
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Speech recognition setup error:", err);
      setError("Failed to start speech recognition.");
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSymptom();
    }
  };

  const resetForm = () => {
    setSymptoms([]);
    setSymptomInput("");
    setSeverity("moderate");
    setDuration("");
    setResult(null);
    setDiagnosis(null);
    setError(null);
  };

  const handleCheckSymptoms = async () => {
    if (symptoms.length === 0) {
      setError("Please add at least one symptom.");
      return;
    }

    if (!duration) {
      setError("Please specify how long you've had these symptoms.");
      return;
    }

    // Don't proceed with API call if emergency detected
    if (isEmergency) return;

    // Check for severe symptoms with long duration
    if (severity === "severe" && parseInt(duration) >= 3) {
      setResult("⚠️ Severe symptoms persisting for multiple days. Medical attention is strongly recommended.");
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDiagnosis(null);

    try {
      const response = await fetch(`${BACKEND_URL}api/symptoms/nlp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: symptoms.map(s => s.name.toLowerCase()),
          severity,
          duration: parseInt(duration) || 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        setResult(`${data.message}`);
      } else if (Array.isArray(data) && data.length > 0) {
        setDiagnosis(data);
      } else {
        setResult("No specific conditions matched your symptoms. If symptoms persist, please consult a healthcare professional.");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to analyze symptoms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get badge color based on severity level
  const getSeverityColor = (level?: string) => {
    switch (level) {
      case "emergency": return "bg-red-500 hover:bg-red-600";
      case "severe": return "bg-orange-500 hover:bg-orange-600";
      case "moderate": return "bg-yellow-500 hover:bg-yellow-600";
      case "mild": return "bg-green-500 hover:bg-green-600";
      default: return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">🩺 Chikitsak Symptom Checker</h1>
        <p className="text-gray-500 mt-2">Enter your symptoms to get insights about potential conditions</p>
      </div>

      {error && (
        <Alert variant={error.includes("Detected symptoms") ? "default" : "destructive"} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.includes("Detected symptoms") ? "Detection Results" : "Error"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isEmergency && (
        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-300">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Medical Emergency Detected</AlertTitle>
          <AlertDescription className="mt-1">
            One or more of your symptoms may indicate a serious medical condition requiring immediate attention.
            Please contact emergency services or go to the nearest emergency room immediately.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Symptom Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a symptom..."
                className="w-full"
                disabled={isListening}
              />
              {suggestedSymptoms.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                  {suggestedSymptoms.map((suggestion, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      onClick={() => addSymptom(suggestion.name)}
                    >
                      <span>{suggestion.name}</span>
                      <Badge className={`text-xs ${getSeverityColor(suggestion.severityLevel)}`}>
                        {suggestion.severityLevel || "mild"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => addSymptom()} disabled={!symptomInput.trim() || isListening}>
                    <Plus size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add symptom</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isListening ? "destructive" : "outline"} 
                    onClick={startVoiceRecognition}
                    disabled={isListening}
                  >
                    {isListening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Speak your symptoms</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="severity">Symptom Severity</label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild - Noticeable but manageable</SelectItem>
                  <SelectItem value="moderate">Moderate - Affecting daily activities</SelectItem>
                  <SelectItem value="severe">Severe - Significantly limiting function</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="duration">Duration (days)</label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="How many days?"
              />
            </div>
          </div>

          {symptoms.length > 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Selected Symptoms:</label>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className={`px-3 py-1 ${getSeverityColor(symptom.severityLevel)}`}
                  >
                    {symptom.name}
                    <button
                      onClick={() => removeSymptom(idx)}
                      className="ml-2 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 my-4">
              <p>No symptoms added yet. Type or speak your symptoms to begin.</p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button 
              onClick={handleCheckSymptoms} 
              disabled={loading || symptoms.length === 0 || !duration || isEmergency}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="whitespace-pre-wrap">{result}</p>
          </CardContent>
        </Card>
      )}

      {diagnosis && diagnosis.length > 0 && (
        <Card className="border-2 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Possible Conditions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {diagnosis.map((item, idx) => (
                <div key={idx} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{item.disease}</h3>
                    <Badge variant="outline">
                      Match Score: {item.matches}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              ))}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  This analysis is for informational purposes only and should not replace professional medical advice.
                  If symptoms persist or worsen, please consult a healthcare provider.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymptomChecker;
