"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomInput(transcript);
        setListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

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
          placeholder="Enter symptom (e.g. headache)"
        />
        <Button onClick={addSymptom}>Add</Button>
        <Button variant="outline" onClick={startListening}>
          {listening ? "🎤 Listening..." : "🎙️ Speak"}
        </Button>
      </div>

      {symptoms.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Your symptoms:</p>
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
