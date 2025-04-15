
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Smile, Moon } from "lucide-react";

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

export default function MentalHealthSupport() {
  useRequireAuth("patient");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

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
                onClick={() => setSelectedResource(resource)}
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
          </div>

          {selectedResource && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{selectedResource.title}</h2>
              <p className="mb-4">{selectedResource.description}</p>
              <Button>Start Now</Button>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
