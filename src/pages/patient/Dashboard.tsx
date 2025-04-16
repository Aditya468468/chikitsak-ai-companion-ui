import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HealthSummary, defaultMetrics } from "@/components/ui/HealthSummary";
import { ActionButton } from "@/components/ui/ActionButton";
import { Link } from "react-router-dom";
import { Heart, Stethoscope, MessagesSquare, ShieldAlert, LifeBuoy, Plus, X, Calendar, PlusCircle } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState, useEffect } from "react";

export default function PatientDashboard() {
  // Use authentication hook to ensure user is logged in
  const { user, isAuthenticated } = useRequireAuth("patient");
  const [loading, setLoading] = useState(true);
  
  // Get user name from metadata if available
  const firstName = user?.user_metadata?.first_name || "Rajesh";
  const lastName = user?.user_metadata?.last_name || "Sharma";
  const userName = `${firstName} ${lastName}`.trim();
  
  // State for appointments and medications
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Priya Patel",
      specialty: "General Physician",
      date: "Tomorrow",
      time: "10:00 AM",
      color: "primary"
    },
    {
      id: 2,
      doctorName: "Dr. Vikram Mehta",
      specialty: "Cardiologist",
      date: "Fri, 18 Apr",
      time: "2:30 PM",
      color: "health-purple"
    }
  ]);
  
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Amoxicillin",
      dosage: "500mg, 3 times daily",
      status: "Active",
      color: "health-pink"
    },
    {
      id: 2,
      name: "Paracetamol",
      dosage: "500mg, as needed",
      status: "Active",
      color: "health-lightblue"
    }
  ]);
  
  // State for modals
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  
  // State for new appointment and medication
  const [newAppointment, setNewAppointment] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    color: "primary"
  });
  
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    status: "Active",
    color: "health-lightblue"
  });
  
  // Function to add new appointment
  const addAppointment = (e) => {
    e.preventDefault();
    const id = appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    setAppointments([...appointments, { ...newAppointment, id }]);
    setNewAppointment({
      doctorName: "",
      specialty: "",
      date: "",
      time: "",
      color: "primary"
    });
    setShowAppointmentModal(false);
  };
  
  // Function to add new medication
  const addMedication = (e) => {
    e.preventDefault();
    const id = medications.length ? Math.max(...medications.map(m => m.id)) + 1 : 1;
    setMedications([...medications, { ...newMedication, id }]);
    setNewMedication({
      name: "",
      dosage: "",
      status: "Active",
      color: "health-lightblue"
    });
    setShowMedicationModal(false);
  };
  
  // Function to delete appointment
  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };
  
  // Function to delete medication
  const deleteMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };
  
  useEffect(() => {
    // Once authentication is confirmed, remove loading state
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" userName={userName} />
      
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        
        <main className="flex-1 px-4 pb-12 pt-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Namaste, {userName}</h1>
            <p className="text-gray-600 mb-8">Here's your health summary for today</p>
            
            <HealthSummary metrics={defaultMetrics} className="mb-10" />
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link to="/patient/symptom-checker">
                  <ActionButton 
                    icon={<Stethoscope />}
                    label="Check Symptoms"
                    colorClass="bg-health-lightblue/30 hover:bg-health-lightblue/40 text-primary border-none"
                  />
                </Link>
                
                <Link to="/patient/emergency">
                  <ActionButton 
                    icon={<ShieldAlert />}
                    label="Emergency"
                    variant="destructive"
                    colorClass="bg-destructive/90 hover:bg-destructive"
                  />
                </Link>
                
                <Link to="/patient/mental-health">
                  <ActionButton 
                    icon={<Heart />}
                    label="Mental Health"
                    colorClass="bg-health-pink/30 hover:bg-health-pink/40 text-primary border-none"
                  />
                </Link>
                
                <Link to="/patient/first-aid">
                  <ActionButton 
                    icon={<LifeBuoy />}
                    label="First Aid"
                    colorClass="bg-health-peach/30 hover:bg-health-peach/40 text-primary border-none"
                  />
                </Link>
                
                <Link to="/patient/consult">
                  <ActionButton 
                    icon={<MessagesSquare />}
                    label="Video Consult"
                    colorClass="bg-health-purple/30 hover:bg-health-purple/40 text-primary border-none"
                  />
                </Link>
              </div>
            </section>
            
            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
                  <div className="flex space-x-2">
                    <Link to="/patient/appointments" className="text-primary text-sm hover:underline flex items-center">
                      <span>View All</span>
                    </Link>
                    <button 
                      onClick={() => setShowAppointmentModal(true)} 
                      className="text-primary text-sm hover:underline flex items-center">
                      <PlusCircle className="h-4 w-4 ml-1" />
                      <span className="ml-1">Add</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map(appointment => (
                      <div key={appointment.id} className={`flex border-l-4 border-${appointment.color} pl-4 py-1 relative group`}>
                        <div className="flex-1">
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-500">{appointment.time}</p>
                        </div>
                        <button 
                          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Your Medications</h3>
                  <div className="flex space-x-2">
                    <Link to="/patient/medications" className="text-primary text-sm hover:underline">View All</Link>
                    <button 
                      onClick={() => setShowMedicationModal(true)} 
                      className="text-primary text-sm hover:underline flex items-center">
                      <PlusCircle className="h-4 w-4 ml-1" />
                      <span className="ml-1">Add</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {medications.length > 0 ? (
                    medications.map(medication => (
                      <div key={medication.id} className="flex items-center group relative">
                        <div className={`h-10 w-10 rounded-full bg-${medication.color}/30 flex items-center justify-center mr-4`}>
                          <span className="font-bold">{medication.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-gray-500">{medication.dosage}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            {medication.status}
                          </span>
                        </div>
                        <button 
                          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                          onClick={() => deleteMedication(medication.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No medications</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      
      {/* Add Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Appointment</h3>
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={addAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={newAppointment.doctorName}
                    onChange={(e) => setNewAppointment({...newAppointment, doctorName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Dr. Priya Patel"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={newAppointment.specialty}
                    onChange={(e) => setNewAppointment({...newAppointment, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="General Physician"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Fri, 18 Apr"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="10:00 AM"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Add Appointment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Medication Modal */}
      {showMedicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Medication</h3>
              <button 
                onClick={() => setShowMedicationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={addMedication}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Amoxicillin"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Instructions</label>
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="500mg, 3 times daily"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newMedication.status}
                    onChange={(e) => setNewMedication({...newMedication, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMedicationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Add Medication
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
