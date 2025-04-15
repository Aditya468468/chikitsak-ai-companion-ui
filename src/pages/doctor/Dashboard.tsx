
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AppointmentProps {
  time: string;
  patientName: string;
  reason: string;
  isNext?: boolean;
}

const Appointment = ({ time, patientName, reason, isNext = false }: AppointmentProps) => (
  <Card className={`p-4 mb-4 ${isNext ? "border-primary border-2" : ""}`}>
    <div className="flex items-center">
      <div className={`p-2 rounded-full ${isNext ? "bg-primary/10" : "bg-muted"} mr-4`}>
        <Clock className={`h-5 w-5 ${isNext ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{time}</p>
        <h4 className="font-medium">{patientName}</h4>
        <p className="text-sm text-muted-foreground">{reason}</p>
      </div>
      <Button variant="ghost" size="sm">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  </Card>
);

export default function DoctorDashboard() {
  useRequireAuth("doctor");
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="doctor" />
      <div className="flex flex-1">
        <Sidebar userType="doctor" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600 mb-8">Your medical practice at a glance</p>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patient Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Today's Patients</h3>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">3 completed, 5 upcoming</p>
                  <Button variant="outline" size="sm" asChild className="mt-4">
                    <Link to="/doctor/appointments">View Schedule</Link>
                  </Button>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Mental Health Alerts</h3>
                    <div className="p-2 bg-destructive/10 rounded-full">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Patients with severe anxiety</p>
                  <Button variant="outline" size="sm" asChild className="mt-4">
                    <Link to="/doctor/patients">View Patients</Link>
                  </Button>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Next Appointment</h3>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-xl font-medium">Emily Johnson</p>
                  <p className="text-sm text-muted-foreground">15 minutes from now</p>
                  <Button variant="outline" size="sm" className="mt-4">Prepare Notes</Button>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Mental Health Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Severe Anxiety</span>
                        <span className="text-sm font-medium">2 patients</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Moderate Anxiety</span>
                        <span className="text-sm font-medium">5 patients</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Mild Anxiety</span>
                        <span className="text-sm font-medium">12 patients</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Minimal Anxiety</span>
                        <span className="text-sm font-medium">18 patients</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                  <Button className="w-full mt-6" asChild>
                    <Link to="/doctor/patients">View All Patients</Link>
                  </Button>
                </Card>
                
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Upcoming Appointments</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/doctor/appointments">View All</Link>
                    </Button>
                  </div>
                  
                  <Appointment 
                    time="10:30 AM - Today" 
                    patientName="Emily Johnson" 
                    reason="Follow-up: Anxiety Treatment" 
                    isNext={true}
                  />
                  
                  <Appointment 
                    time="11:15 AM - Today" 
                    patientName="Michael Brown" 
                    reason="Diabetes Management"
                  />
                  
                  <Appointment 
                    time="1:00 PM - Today" 
                    patientName="Sarah Davis" 
                    reason="Depression Therapy"
                  />
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <Card className="p-6">
                <h3 className="text-xl font-medium mb-6">Today's Schedule</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Morning</h4>
                    <Appointment 
                      time="9:00 AM" 
                      patientName="John Smith" 
                      reason="Hypertension Check-up"
                    />
                    <Appointment 
                      time="10:30 AM" 
                      patientName="Emily Johnson" 
                      reason="Follow-up: Anxiety Treatment" 
                      isNext={true}
                    />
                    <Appointment 
                      time="11:15 AM" 
                      patientName="Michael Brown" 
                      reason="Diabetes Management"
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Afternoon</h4>
                    <Appointment 
                      time="1:00 PM" 
                      patientName="Sarah Davis" 
                      reason="Depression Therapy"
                    />
                    <Appointment 
                      time="2:15 PM" 
                      patientName="Thomas Wilson" 
                      reason="Back Pain Follow-up"
                    />
                    <Appointment 
                      time="3:30 PM" 
                      patientName="Jennifer Lee" 
                      reason="Annual Physical"
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Evening</h4>
                    <Appointment 
                      time="4:45 PM" 
                      patientName="Robert Garcia" 
                      reason="Insomnia Consultation"
                    />
                    <Appointment 
                      time="5:30 PM" 
                      patientName="Lisa Taylor" 
                      reason="Medication Review"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="patients">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium">Patient Insights</h3>
                  <Button asChild>
                    <Link to="/doctor/patients">View All Patients</Link>
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Mental health assessment summary based on recent GAD-7 scores from your patients.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Anxiety Level Distribution</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Severe (15-21)</span>
                          <span className="text-sm font-medium">2 patients</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Moderate (10-14)</span>
                          <span className="text-sm font-medium">5 patients</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Mild (5-9)</span>
                          <span className="text-sm font-medium">12 patients</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Minimal (0-4)</span>
                          <span className="text-sm font-medium">18 patients</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Patients Requiring Immediate Attention</h4>
                    <Card className="p-4 mb-4 border-destructive border">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-destructive/10 mr-4">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Sarah Davis</h4>
                          <p className="text-sm text-muted-foreground">GAD Score: 18 (Severe)</p>
                          <p className="text-sm text-muted-foreground">Last Visit: 2025-04-14</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                    <Card className="p-4 border-destructive border">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-destructive/10 mr-4">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Emily Johnson</h4>
                          <p className="text-sm text-muted-foreground">GAD Score: 15 (Severe)</p>
                          <p className="text-sm text-muted-foreground">Last Visit: 2025-04-12</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
