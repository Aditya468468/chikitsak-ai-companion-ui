
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, Phone, User2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VideoConsult() {
  useRequireAuth("patient");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  const startConsultation = () => {
    toast({
      title: "Starting Consultation",
      description: "Connecting to your healthcare provider...",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" />
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-2">Video Consultation</h1>
          <p className="text-gray-600 mb-8">Connect with healthcare providers virtually</p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                {isCameraOn ? (
                  <div className="text-white">Camera Preview</div>
                ) : (
                  <User2 className="w-16 h-16 text-gray-500" />
                )}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant={isCameraOn ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsCameraOn(!isCameraOn)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  variant={isMicOn ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Start Consultation</h2>
              <p className="text-gray-600 mb-6">
                Before starting your consultation, make sure you:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Have a stable internet connection
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Are in a quiet environment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Have tested your camera and microphone
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                disabled={!isCameraOn || !isMicOn}
                onClick={startConsultation}
              >
                Start Consultation
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
