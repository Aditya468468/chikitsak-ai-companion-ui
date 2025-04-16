
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState, useEffect } from "react";

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useRequireAuth("doctor");
  const [loading, setLoading] = useState(true);
  
  // Get user name from metadata
  const firstName = user?.user_metadata?.first_name || "Doctor";
  const lastName = user?.user_metadata?.last_name || "";
  const doctorName = `${firstName} ${lastName}`.trim();
  
  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="doctor" userName={doctorName} />
      
      <div className="flex flex-1">
        <Sidebar userType="doctor" />
        
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {lastName || doctorName}</h1>
          <p className="text-gray-600 mb-6">Here's your dashboard for today</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
              <div className="text-3xl font-bold text-primary">8</div>
              <p className="text-sm text-gray-500">2 more than yesterday</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">New Patients</h3>
              <div className="text-3xl font-bold text-primary">3</div>
              <p className="text-sm text-gray-500">This week</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Critical Cases</h3>
              <div className="text-3xl font-bold text-destructive">2</div>
              <p className="text-sm text-gray-500">Requires attention</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                <div className="flex border-l-4 border-primary pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Amit Singh</p>
                    <p className="text-sm text-gray-500">Consultation</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">10:00 AM</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                </div>
                
                <div className="flex border-l-4 border-health-purple pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Mohit Kumar</p>
                    <p className="text-sm text-gray-500">Follow-up</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">11:30 AM</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                </div>
                
                <div className="flex border-l-4 border-health-lightblue pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Somesh P</p>
                    <p className="text-sm text-gray-500">New Patient</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">2:15 PM</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Patient Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">GAD-7 Scores</p>
                    <p className="text-sm text-gray-500">Last 7 days</p>
                  </div>
                  <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    Chart
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Medications Adherence</p>
                    <p className="text-sm text-gray-500">Last month</p>
                  </div>
                  <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    82%
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appointment Attendance</p>
                    <p className="text-sm text-gray-500">Last month</p>
                  </div>
                  <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    94%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
