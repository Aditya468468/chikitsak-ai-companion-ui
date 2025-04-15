
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HealthSummary, defaultMetrics } from "@/components/ui/HealthSummary";
import { ActionButton } from "@/components/ui/ActionButton";
import { Link } from "react-router-dom";
import { Heart, Stethoscope, MessagesSquare, ShieldAlert, LifeBuoy, Plus } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function PatientDashboard() {
  // Use authentication hook to ensure user is logged in
  useRequireAuth("patient");
  
  const userName = "Alex Johnson"; // In a real app, this would come from authentication
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" userName={userName} />
      
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        
        <main className="flex-1 px-4 pb-12 pt-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Good morning, {userName}</h1>
            <p className="text-gray-600 mb-8">Here's your health summary for today</p>
            
            <HealthSummary metrics={defaultMetrics} className="mb-10" />
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <ActionButton 
                  icon={<Stethoscope />}
                  label="Check Symptoms"
                  colorClass="bg-health-lightblue/30 hover:bg-health-lightblue/40 text-primary border-none"
                >
                  <Link to="/patient/symptom-checker">Check Symptoms</Link>
                </ActionButton>
                
                <ActionButton 
                  icon={<ShieldAlert />}
                  label="Emergency"
                  variant="destructive"
                  colorClass="bg-destructive/90 hover:bg-destructive"
                >
                  <Link to="/patient/emergency">Emergency</Link>
                </ActionButton>
                
                <ActionButton 
                  icon={<Heart />}
                  label="Mental Health"
                  colorClass="bg-health-pink/30 hover:bg-health-pink/40 text-primary border-none"
                >
                  <Link to="/patient/mental-health">Mental Health</Link>
                </ActionButton>
                
                <ActionButton 
                  icon={<LifeBuoy />}
                  label="First Aid"
                  colorClass="bg-health-peach/30 hover:bg-health-peach/40 text-primary border-none"
                >
                  <Link to="/patient/first-aid">First Aid</Link>
                </ActionButton>
                
                <ActionButton 
                  icon={<MessagesSquare />}
                  label="Video Consult"
                  colorClass="bg-health-purple/30 hover:bg-health-purple/40 text-primary border-none"
                >
                  <Link to="/patient/consult">Video Consult</Link>
                </ActionButton>
              </div>
            </section>
            
            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
                  <Link to="/patient/appointments" className="text-primary text-sm hover:underline flex items-center">
                    <span>View All</span>
                    <Plus className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="flex border-l-4 border-primary pl-4 py-1">
                    <div className="flex-1">
                      <p className="font-medium">Dr. Sarah Wilson</p>
                      <p className="text-sm text-gray-500">General Physician</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tomorrow</p>
                      <p className="text-sm text-gray-500">10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex border-l-4 border-health-purple pl-4 py-1">
                    <div className="flex-1">
                      <p className="font-medium">Dr. Michael Chen</p>
                      <p className="text-sm text-gray-500">Cardiologist</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Fri, 18 Apr</p>
                      <p className="text-sm text-gray-500">2:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Your Medications</h3>
                  <Link to="/patient/medications" className="text-primary text-sm hover:underline">View All</Link>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-health-pink/30 flex items-center justify-center mr-4">
                      <span className="font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Amoxicillin</p>
                      <p className="text-sm text-gray-500">500mg, 3 times daily</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-health-lightblue/30 flex items-center justify-center mr-4">
                      <span className="font-bold">P</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Paracetamol</p>
                      <p className="text-sm text-gray-500">500mg, as needed</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
