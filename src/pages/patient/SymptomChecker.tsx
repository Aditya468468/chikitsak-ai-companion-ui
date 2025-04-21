"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BACKEND_URL = "https://chikitsak-backend.onrender.com/";

type Symptom = {
  name: string;
};

const SymptomChecker: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState("mild");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, { name: symptomInput.trim() }]);
      setSymptomInput("");
    }
  };

  const handleCheckSymptoms = async () => {
    const symptomNames = symptoms.map((s) => s.name.toLowerCase());

    // Emergency conditions
    const emergencySymptoms = ["chest pain", "shortness of breath", "seizure", "unconsciousness"];
    const isEmergency = symptomNames.some((symptom) =>
      emergencySymptoms.includes(symptom)
    );

    if (isEmergency) {
      setResult("⚠️ Emergency detected! Seek immediate medical attention.");
      return;
    }

    if (severity === "severe" && parseInt(duration) >= 2) {
      setResult("⚠️ Severe symptoms for multiple days. Medical attention recommended.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}api/symptoms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: symptomNames }),
      });

      const data = await response.json();

      if (data.message) {
        setResult(data.message);
      } else {
        const diseases = data.map((item: any) => `${item.disease} (score: ${item.matches})`);
        setResult(`Top possible diseases:\n${diseases.join("\n")}`);
      }
    } catch (error) {
      console.error("Error checking symptoms:", error);
      setResult("Something went wrong while checking symptoms.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Symptom Checker</h1>

      <div className="flex gap-2">
        <Input
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder="Enter a symptom"
        />
        <Button onClick={addSymptom}>Add</Button>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">Severity</label>
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

        <div className="w-1/2">
          <label className="block text-sm font-medium">Duration (in days)</label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 2"
          />
        </div>
      </div>

      <Button className="mt-4" onClick={handleCheckSymptoms}>
        Check Symptoms
      </Button>

      {result && (
        <Card className="mt-4">
          <CardContent className="p-4 whitespace-pre-wrap">{result}</CardContent>
        </Card>
      )}

      {symptoms.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-1">Selected Symptoms:</h2>
          <ul className="list-disc list-inside">
            {symptoms.map((s, idx) => (
              <li key={idx}>{s.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
