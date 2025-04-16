import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HealthSummary, defaultMetrics } from "@/components/ui/HealthSummary";
import { ActionButton } from "@/components/ui/ActionButton";
import { Link } from "react-router-dom";
import { Heart, Stethoscope, MessagesSquare, ShieldAlert, LifeBuoy, Plus } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState, useEffect } from "react";

export default function PatientDashboard() {
  const { user, isAuthenticated } = useRequireAuth("patient");
  const [loading, setLoading] = useState(true);

  // Get user name from metadata if available
  const firstName = user?.user_metadata?.first_name || "Patient";
  const lastName = user?.user_metadata?.last_name || "";
  const userName = `${firstName} ${lastName}`.trim();

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Mock data for appointments and medications
  const [appointments, setAppointments] = useState([
    { doctor: "Dr. Sarah Wilson", specialty: "General Physician", date: "Tomorrow", time: "10:00 AM", status: "Upcoming" },
    { doctor: "Dr. Michael Chen", specialty: "Cardiologist", date: "Fri, 18 Apr", time: "2:30 PM", status: "Upcoming" }
  ]);

  const [medications, setMedications] = useState([
    { name: "Amoxicillin", dosage: "500mg, 3 times daily", status: "Active" },
    { name: "Paracetamol", dosage: "500mg, as needed", status: "Active" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ doctor: "", specialty: "", date: "", time: "" });
  const [newMedication, setNewMedication] = useState({ name: "", dosage: "", status: "Active" });

  const handleAddAppointment = () => {
    setAppointments([...appointments, newAppointment]);
    setNewAppointment({ doctor: "", specialty: "", date: "", time: "" });
    setShowModal(false);
  };

  const handleAddMedication = () => {
    setMedications([...medications, newMedication]);
    setNewMedication({ name: "", dosage: "", status: "Active" });
    setShowModal(false);
  };

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
            <h1 className="text-3xl font-bold mb-2">Good Evening, {userName}</h1>
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
                  <button onClick={() => setShowModal(true)} className="text-primary text-sm hover:underline flex items-center">
                    <span>Add New</span>
                    <Plus className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex border-l-4 border-primary pl-4 py-1">
                      <div className="flex-1">
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.date}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Your Medications</h3>
                  <button onClick={() => setShowModal(true)} className="text-primary text-sm hover:underline">
                    Add New
                  </button>
                </div>

                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-health-pink/30 flex items-center justify-center mr-4">
                        <span className="font-bold">{med.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-500">{med.dosage}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          {med.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Modal for adding new data */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl animate-fadeIn border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Item</h2>

            <div>
              <input
                placeholder="Doctor's Name"
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                placeholder="Specialty"
                value={newAppointment.specialty}
                onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                placeholder="Date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                placeholder="Time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAppointment}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}
      </style>
    </div>
  );
}
