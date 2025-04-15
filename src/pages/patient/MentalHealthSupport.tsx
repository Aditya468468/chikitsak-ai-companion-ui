
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Smile, Moon, Plus, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface Resource {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const resources: Resource[] = [
  {
    title: "Meditation Exercises",
    description: "Guided meditation sessions to help reduce stress and anxiety",
    icon: <Brain className="w-6 h-6" />,
    link: "#meditation"
  },
  {
    title: "Mood Tracking",
    description: "Track your daily mood and identify patterns",
    icon: <Heart className="w-6 h-6" />,
    link: "#mood"
  },
  {
    title: "Relaxation Techniques",
    description: "Simple techniques for stress relief and relaxation",
    icon: <Moon className="w-6 h-6" />,
    link: "#relaxation"
  },
  {
    title: "Self-Care Tips",
    description: "Daily practices to maintain mental well-being",
    icon: <Smile className="w-6 h-6" />,
    link: "#selfcare"
  }
];

// GAD-7 questions
const gadQuestions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

// Score interpretation
const getGADInterpretation = (score: number) => {
  if (score >= 0 && score <= 4) return { level: "Minimal Anxiety", severity: "low" };
  if (score >= 5 && score <= 9) return { level: "Mild Anxiety", severity: "mild" };
  if (score >= 10 && score <= 14) return { level: "Moderate Anxiety", severity: "moderate" };
  return { level: "Severe Anxiety", severity: "severe" };
};

export default function MentalHealthSupport() {
  useRequireAuth("patient");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showGAD, setShowGAD] = useState(false);
  const [gadResponses, setGadResponses] = useState<number[]>(Array(7).fill(0));
  const [testCompleted, setTestCompleted] = useState(false);
  
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowGAD(false);
    setTestCompleted(false);
  };
  
  const handleGADClick = () => {
    setSelectedResource(null);
    setShowGAD(true);
    setTestCompleted(false);
  };
  
  const handleGADResponse = (questionIndex: number, value: number) => {
    const newResponses = [...gadResponses];
    newResponses[questionIndex] = value;
    setGadResponses(newResponses);
  };
  
  const calculateGADScore = () => {
    return gadResponses.reduce((sum, value) => sum + value, 0);
  };
  
  const submitGADTest = () => {
    const score = calculateGADScore();
    const interpretation = getGADInterpretation(score);
    
    toast({
      title: "GAD-7 Assessment Complete",
      description: `Your score: ${score} - ${interpretation.level}`,
      variant: interpretation.severity === "severe" ? "destructive" : "default"
    });
    
    setTestCompleted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-2">Mental Health Support</h1>
          <p className="text-gray-600 mb-8">Access mental health resources and support</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {resources.map((resource) => (
              <Card 
                key={resource.title}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleResourceClick(resource)}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {resource.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </Card>
            ))}
            
            <Card 
              className="p-6 hover:shadow-md transition-shadow cursor-pointer border-dashed border-2"
              onClick={handleGADClick}
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">GAD-7 Assessment</h3>
              <p className="text-sm text-gray-600">Take a Generalized Anxiety Disorder assessment</p>
            </Card>
          </div>

          {selectedResource && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <div className="mr-3 text-primary">{selectedResource.icon}</div>
                {selectedResource.title}
              </h2>
              <p className="mb-6 text-gray-600">{selectedResource.description}</p>
              
              <div className="space-y-4">
                <p>Content for {selectedResource.title} will be available soon.</p>
                <Button onClick={() => window.open(selectedResource.link, '_blank')}>Start Now</Button>
              </div>
            </Card>
          )}
          
          {showGAD && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-3 text-yellow-500" />
                GAD-7 Anxiety Assessment
              </h2>
              
              {!testCompleted ? (
                <>
                  <p className="mb-6 text-gray-600">
                    Over the last 2 weeks, how often have you been bothered by the following problems?
                  </p>
                  
                  <div className="space-y-6">
                    {gadQuestions.map((question, index) => (
                      <div key={index} className="space-y-3">
                        <p className="font-medium">{index + 1}. {question}</p>
                        <RadioGroup 
                          value={gadResponses[index].toString()} 
                          onValueChange={(value) => handleGADResponse(index, parseInt(value, 10))}
                          className="flex justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id={`q${index}-0`} />
                            <Label htmlFor={`q${index}-0`}>Not at all</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id={`q${index}-1`} />
                            <Label htmlFor={`q${index}-1`}>Several days</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id={`q${index}-2`} />
                            <Label htmlFor={`q${index}-2`}>More than half the days</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id={`q${index}-3`} />
                            <Label htmlFor={`q${index}-3`}>Nearly every day</Label>
                          </div>
                        </RadioGroup>
                        <Separator />
                      </div>
                    ))}
                    <Button onClick={submitGADTest} className="mt-6">Submit Assessment</Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Score: {calculateGADScore()}/21</span>
                      <span>{getGADInterpretation(calculateGADScore()).level}</span>
                    </div>
                    <Progress 
                      value={(calculateGADScore() / 21) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="p-4 rounded-md bg-muted">
                    <h3 className="font-medium mb-2">What your score means:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">0-4:</span> Minimal anxiety</li>
                      <li><span className="font-medium">5-9:</span> Mild anxiety</li>
                      <li><span className="font-medium">10-14:</span> Moderate anxiety</li>
                      <li><span className="font-medium">15-21:</span> Severe anxiety</li>
                    </ul>
                    <p className="mt-4 text-sm">
                      If your score indicates moderate to severe anxiety, consider reaching out to a mental health professional for further assessment and support.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button onClick={() => setTestCompleted(false)}>Retake Assessment</Button>
                    <Button variant="outline" onClick={() => setShowGAD(false)}>Close</Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
