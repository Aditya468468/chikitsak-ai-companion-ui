import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Symptom {
  id: number;
  name: string;
  severity: "mild" | "moderate" | "severe";
  duration: string;
}

// Common symptom patterns for basic conditions
const conditionPatterns = {
  commonCold: ["cough", "runny nose", "sore throat", "congestion", "sneezing"],
  flu: ["fever", "fatigue", "body ache", "headache", "chills"],
  covid: ["fever", "cough", "shortness of breath", "loss of taste", "loss of smell"],
  allergies: ["itchy eyes", "sneezing", "runny nose", "congestion"],
  foodPoisoning: ["nausea", "vomiting", "diarrhea", "stomach cramps"],
  migraine: ["headache", "sensitivity to light", "nausea", "visual disturbances"],
  anxiety: ["rapid heartbeat", "sweating", "trembling", "shortness of breath"],
  dehydration: ["thirst", "dry mouth", "fatigue", "dizziness", "dark urine"],
};

// Emergency symptoms that require immediate attention
const emergencySymptoms = [
  "chest pain", 
  "difficulty breathing", 
  "severe bleeding", 
  "confusion", 
  "loss of consciousness",
  "severe headache",
  "inability to move",
  "numbness on one side",
  "slurred speech",
  "seizure"
];

export default function SymptomChecker() {
  useRequireAuth("patient");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("mild");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<{ title: string; description: string; urgency: "low" | "medium" | "high" } | null>(null);

  const addSymptom = () => {
    if (!currentSymptom) {
      toast({
        title: "Missing Information",
        description: "Please enter a symptom",
        variant: "destructive"
      });
      return;
    }

    const newSymptom: Symptom = {
      id: Date.now(),
      name: currentSymptom,
      severity,
      duration
    };

    setSymptoms([...symptoms, newSymptom]);
    setCurrentSymptom("");
    setDuration("");
  };

  const removeSymptom = (id: number) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const checkSymptoms = () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add at least one symptom",
        variant: "destructive"
      });
      return;
    }

    // Check for emergency symptoms first
    for (const symptom of symptoms) {
      if (emergencySymptoms.some(es => symptom.name.toLowerCase().includes(es.toLowerCase()))) {
        setResult({
          title: "Seek Immediate Medical Attention",
          description: `Your symptom "${symptom.name}" may indicate a serious medical condition that requires immediate attention.`,
          urgency: "high"
        });
        toast({
          title: "Emergency Warning",
          description: "You may have a serious condition. Please seek immediate medical attention.",
          variant: "destructive"
        });
        return;
      }
    }

    // Check for severe symptoms lasting more than 3 days
    const severeSymptomsLongDuration = symptoms.filter(s => {
      const durationMatch = s.duration.match(/(\d+)\s*(day|days)/i);
      const durationDays = durationMatch ? parseInt(durationMatch[1]) : 0;
      return s.severity === "severe" && durationDays >= 3;
    });

    if (severeSymptomsLongDuration.length > 0) {
      setResult({
        title: "Medical Attention Recommended",
        description: "You have severe symptoms that have lasted for several days. We recommend consulting with a healthcare provider soon.",
        urgency: "high"
      });
      toast({
        title: "Warning",
        description: "Severe symptoms for multiple days detected. Medical consultation recommended.",
        variant: "destructive"
      });
      return;
    }

    // Check if symptoms match common conditions
    const symptomsLower = symptoms.map(s => s.name.toLowerCase());
    const matchedConditions = [];
    
    for (const [condition, patterns] of Object.entries(conditionPatterns)) {
      const matchCount = patterns.filter(pattern => 
        symptomsLower.some(s => s.includes(pattern.toLowerCase()))
      ).length;
      
      const matchPercentage = patterns.length > 0 ? matchCount / patterns.length : 0;
      
      if (matchPercentage >= 0.5) {
        matchedConditions.push({
          name: condition,
          matchPercentage: matchPercentage
        });
      }
    }

    // Sort conditions by match percentage
    matchedConditions.sort((a, b) => b.matchPercentage - a.matchPercentage);

    if (matchedConditions.length > 0) {
      const topCondition = matchedConditions[0];
      let conditionName = "";
      let recommendation = "";
      let urgency: "low" | "medium" | "high" = "low";
      
      // Format condition name
      switch(topCondition.name) {
        case "commonCold":
          conditionName = "Common Cold";
          recommendation = "Rest, stay hydrated, and consider over-the-counter cold medication.";
          urgency = "low";
          break;
        case "flu":
          conditionName = "Flu";
          recommendation = "Rest, stay hydrated, and take fever reducers if needed. Consult a doctor if symptoms worsen.";
          urgency = "medium";
          break;
        case "covid":
          conditionName = "COVID-19";
          recommendation = "Consider getting tested for COVID-19. Self-isolate and consult a healthcare provider.";
          urgency = "medium";
          break;
        case "allergies":
          conditionName = "Allergies";
          recommendation = "Consider antihistamines and avoiding allergens.";
          urgency = "low";
          break;
        case "foodPoisoning":
          conditionName = "Food Poisoning";
          recommendation = "Stay hydrated and rest. Seek medical attention if symptoms persist beyond 48 hours.";
          urgency = "medium";
          break;
        case "migraine":
          conditionName = "Migraine";
          recommendation = "Rest in a dark, quiet room. Consider over-the-counter pain relievers.";
          urgency = "low";
          break;
        case "anxiety":
          conditionName = "Anxiety";
          recommendation = "Try deep breathing exercises and relaxation techniques. Consider speaking with a mental health professional.";
          urgency = "low";
          break;
        case "dehydration":
          conditionName = "Dehydration";
          recommendation = "Drink fluids with electrolytes. Seek medical attention if severe.";
          urgency = "medium";
          break;
        default:
          conditionName = topCondition.name;
          recommendation = "Consider consulting with a healthcare provider.";
          urgency = "medium";
      }
      
      setResult({
        title: `Possible ${conditionName}`,
        description: `Your symptoms match patterns of ${conditionName}. ${recommendation}`,
        urgency
      });
      
      toast({
        title: `Possible ${conditionName}`,
        description: recommendation,
        variant: urgency === "high" ? "destructive" : "default"
      });
      return;
    }

    // If no specific condition matched
    const hasModerateSeverity = symptoms.some(s => s.severity === "moderate");
    
    if (hasModerateSeverity) {
      setResult({
        title: "Multiple Symptoms Detected",
        description: "Your combination of symptoms may require medical attention. Consider consulting with a healthcare provider.",
        urgency: "medium"
      });
    } else {
      setResult({
        title: "Mild Symptoms Detected",
        description: "Your symptoms appear to be mild. Monitor them and rest. If they persist or worsen, consider consulting with a healthcare provider.",
        urgency: "low"
      });
    }

    toast({
      title: "Analysis Complete",
      description: "We've analyzed your symptoms. See the results below.",
    });
  };

  const getUrgencyClass = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "low":
        return "bg-green-50 border-green-200 text-green-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "high":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-2">Symptom Checker</h1>
          <p className="text-gray-600 mb-8">Track and assess your symptoms</p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Symptoms</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Symptom</label>
                  <Input
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    placeholder="Enter symptom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <div className="flex gap-2">
                    {["mild", "moderate", "severe"].map((s) => (
                      <Button
                        key={s}
                        variant={severity === s ? "default" : "outline"}
                        onClick={() => setSeverity(s as "mild" | "moderate" | "severe")}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 days"
                  />
                </div>

                <Button onClick={addSymptom} className="w-full">
                  Add Symptom
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Symptoms</h2>
              
              {symptoms.length === 0 ? (
                <p className="text-gray-500">No symptoms added yet</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="p-4 rounded-lg border flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{symptom.name}</h3>
                        <p className="text-sm text-gray-600">
                          Severity: {symptom.severity}, Duration: {symptom.duration}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={checkSymptoms}
                className="w-full"
                disabled={symptoms.length === 0}
              >
                Check Symptoms
              </Button>
            </Card>

            {result && (
              <Card className={`p-6 md:col-span-2 border-2 ${getUrgencyClass(result.urgency)}`}>
                <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                <p>{result.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium">
                    {result.urgency === "high" ? 
                      "⚠️ Urgent: Please seek immediate medical attention" :
                      result.urgency === "medium" ?
                      "⚠️ Consider consulting with a healthcare provider soon" :
                      "👍 Monitor your symptoms and rest"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Note: This is not a medical diagnosis. Always consult with a healthcare professional for proper medical advice.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
