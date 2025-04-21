"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BACKEND_URL = "https://chikitsak-backend.onrender.com/";

const knownSymptoms = [
  "fever",
  "cough",
  "headache",
  "sore throat",
  "runny nose",
  "chest pain",
  "shortness of breath",
  "seizure",
  "unconsciousness",
  "fatigue",
  "nausea",
  "vomiting",
  "diarrhea",
  "dizziness",
  "rash",
  "muscle pain",
  "joint pain",
];

type Symptom = {
  name: string;
};

const SymptomChecker: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState("mild");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);

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
      if (
        lowerText.includes(symptom.toLowerCase()) &&
        !symptoms.find((s) => s.name === symptom)
      ) {
        detected.push(symptom);
      }
    });

    const detectedObjs = detected.map((s) => ({ name: s }));
    setSymptoms((prev) => [...prev, ...detectedObjs]);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      extractSymptoms(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleCheckSymptoms = async () => {
    if (symptoms.length === 0) return;

    const symptomNames = symptoms.map((s) => s.name.toLowerCase());

    const emergencySymptoms = [
      "chest pain",
      "shortness of breath",
      "seizure",
      "unconsciousness",
    ];
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
        const diseases = data.map(
          (item: any) => `• ${item.disease} (score: ${item.matches})`
        );
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
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">🩺 Symptom Checker</h1>

      <div className="flex gap-2">
        <Input
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          placeholder="Enter a symptom"
        />
        <Button onClick={addSymptom}>Add</Button>
        <Button variant="outline" onClick={startVoiceRecognition}>
          🎤 Speak
        </Button>
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

      <Button className="mt-4" onClick={handleCheckSymptoms} disabled={loading}>
        {loading ? "Checking..." : "Check Symptoms"}
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
