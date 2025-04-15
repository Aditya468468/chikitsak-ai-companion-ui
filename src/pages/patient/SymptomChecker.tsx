
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

export default function SymptomChecker() {
  useRequireAuth("patient");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("mild");
  const [duration, setDuration] = useState("");

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

  const checkSymptoms = () => {
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms",
        description: "Please add at least one symptom",
        variant: "destructive"
      });
      return;
    }

    // Check for severe symptoms
    const hasSevereSymptoms = symptoms.some(s => s.severity === "severe");
    
    if (hasSevereSymptoms) {
      toast({
        title: "Warning",
        description: "You have severe symptoms. Please seek immediate medical attention.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Symptoms Checked",
        description: "Based on your symptoms, we recommend consulting with a healthcare provider.",
      });
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
                      className="p-4 rounded-lg border"
                    >
                      <h3 className="font-medium">{symptom.name}</h3>
                      <p className="text-sm text-gray-600">
                        Severity: {symptom.severity}, Duration: {symptom.duration}
                      </p>
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
          </div>
        </main>
      </div>
    </div>
  );
}
