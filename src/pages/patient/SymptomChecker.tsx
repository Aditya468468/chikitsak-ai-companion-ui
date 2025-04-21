"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BACKEND_URL = "https://chikitsak-backend.onrender.com/";

const knownSymptoms = [
  "fever", "headache", "cough", "cold", "sore throat", "nausea", "vomiting",
  "diarrhea", "fatigue", "chest pain", "shortness of breath", "dizziness",
  "rash", "joint pain", "muscle pain", "sneezing", "runny nose", "congestion",
  "sensitivity to light", "seizure", "unconsciousness", "abdominal pain"
];

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

  const extractSymptoms = (text: string) => {
    const detected: string[] = [];
    const lowerText = text.toLowerCase();
    knownSymptoms.forEach((symptom) => {
      if (lowerText.includes(symptom) && !symptoms.find(s => s.name === symptom)) {
        detected.push(symptom);
      }
    });

    if (detected.length > 0) {
      setSymptoms([...symptoms, ...detected.map((s) => ({ name: s }))]);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptomInput(transcript);
      extractSymptoms(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleCheckSymptoms = async () => {
    const symptomNames = symptoms.map((s) => s.name.toLowerCase());
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}api/symptoms/nlp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: symptomNames,
          severity,
          duration,
        }),
      });

      const data = await response.json();

      if (data.message) {
        setResult(`🤖 ${data.message}`);
      } else {
        const diseases = data.map((item: any) => `• ${item.disease} (score: ${item.matches})`);
        setResult(`✅ Diseases found based on your symptoms:\n\n${diseases.join("\n")}`);
      }
    } catch (error) {
      console.error(error);
      setResult("❌ Something went wrong while processing the symptoms.");
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
          placeholder="Enter or speak a symptom"
        />
        <Button onClick={addSymptom}>Add</Button>
        <Button variant="outline" onClick={handleVoiceInput}>🎤 Speak</Button>
      </div>

      {symptoms.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Detected symptoms:</p>
          <ul className="flex flex-wrap gap-2">
            {symptoms.map((s, idx) => (
              <li key={idx} className="bg-gray-100 text-sm px-3 py-1 rounded-full border">
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
            placeholder="e.g., 3"
          />
        </div>
      </div>

      <Button
        className="w-full mt-4"
        onClick={handleCheckSymptoms}
        disabled={loading || symptoms.length === 0}
      >
        {loading ? "Checking..." : "Check Symptoms"}
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
