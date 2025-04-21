"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const BACKEND_URL = "https://chikitsak-backend.onrender.com/";

type Symptom = { name: string };

const SymptomChecker: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState("mild");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, { name: symptomInput.trim() }]);
      setSymptomInput("");
    }
  };

  const handleCheckSymptoms = async () => {
    const symptomNames = symptoms.map((s) => s.name.toLowerCase());
    setLoading(true);
    setResult(null);

    const emergencySymptoms = ["chest pain", "shortness of breath", "seizure", "unconsciousness"];
    const isEmergency = symptomNames.some((symptom) =>
      emergencySymptoms.includes(symptom)
    );

    if (isEmergency) {
      setResult("🚨 Looks like you mentioned a critical symptom. Please seek emergency care immediately.");
      setLoading(false);
      return;
    }

    if (severity === "severe" && parseInt(duration) >= 2) {
      setResult("⚠️ You've had severe symptoms for a while. It’s best to consult a doctor soon.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}api/symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomNames }),
      });

      const data = await response.json();

      if (data.message) {
        setResult(`🤖 ${data.message}`);
      } else {
        const diseases = data.map((item: any) => `• ${item.disease} (match score: ${item.matches})`);
        setResult(`✅ Here's what we found based on your symptoms:\n\n${diseases.join("\n")}`);
      }
    } catch (error) {
      console.error(error);
      setResult("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🩺 Symptom Checker</h1>

      <div className="flex gap-2">
        <Input
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder="e.g. headache, fever"
        />
        <Button onClick={addSymptom}>Add</Button>
      </div>

      {symptoms.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Your symptoms:</p>
          <ul className="flex flex-wrap gap-2">
            {symptoms.map((s, idx) => (
              <li
                key={idx}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full border"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (days)</label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
      </div>

      <Button
        className="w-full mt-4"
        onClick={handleCheckSymptoms}
        disabled={loading || symptoms.length === 0}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Checking...
          </>
        ) : (
          "Check Now"
        )}
      </Button>

      {result && (
        <Card className="mt-6">
          <CardContent className="p-4 whitespace-pre-wrap leading-relaxed text-base">
            {result}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymptomChecker;
