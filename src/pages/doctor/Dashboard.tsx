import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState, useEffect } from "react";

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useRequireAuth("doctor");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(null);
  
  // Get user name from metadata
  const firstName = user?.user_metadata?.first_name || "Doctor";
  const lastName = user?.user_metadata?.last_name || "";
  const doctorName = `${firstName} ${lastName}`.trim();
  
  // Interactive states
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New test results for Mohit Kumar", read: false },
    { id: 2, text: "Meeting with Dr. Patel at 4PM", read: false },
    { id: 3, text: "Amit Singh rescheduled to tomorrow", read: true },
  ]);
  
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      name: "Amit Singh", 
      type: "Consultation", 
      time: "10:00 AM", 
      day: "Today",
      colorClass: "border-primary",
      details: "Blood pressure check, discussing medication side effects",
      notes: "Patient mentioned headaches, check previous prescription"
    },
    { 
      id: 2, 
      name: "Mohit Kumar", 
      type: "Follow-up", 
      time: "11:30 AM", 
      day: "Today",
      colorClass: "border-health-purple",
      details: "Two weeks after starting new medication",
      notes: "Check if symptoms have improved, possible dosage adjustment"
    },
    { 
      id: 3, 
      name: "Somesh P", 
      type: "New Patient", 
      time: "2:15 PM", 
      day: "Today",
      colorClass: "border-health-lightblue",
      details: "Initial consultation for anxiety",
      notes: "Referred by Dr. Gupta, bring medical history"
    },
    { 
      id: 4, 
      name: "Priya Desai", 
      type: "Telehealth", 
      time: "4:00 PM", 
      day: "Today",
      colorClass: "border-green-500",
      details: "Virtual follow-up consultation",
      notes: "Check progress on therapy exercises"
    }
  ]);
  
  const [stats, setStats] = useState({
    todayAppointments: 8,
    yesterdayAppointments: 6,
    newPatients: 3,
    criticalCases: 2
  });
  
  // For the chart toggles
  const [selectedChart, setSelectedChart] = useState("weekly");
  
  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(note => 
      note.id === id ? {...note, read: true} : note
    ));
  };
  
  const handleAppointmentClick = (id) => {
    if (showAppointmentDetails === id) {
      setShowAppointmentDetails(null);
    } else {
      setShowAppointmentDetails(id);
    }
  };
  
  const renderTab = () => {
    switch(activeTab) {
      case "dashboard":
        return renderDashboard();
      case "patients":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Patient Management</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Patient List</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search patients..." 
                    className="border rounded-lg px-4 py-2 pl-10 text-sm"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{apt.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 28, 2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark mr-4">View</button>
                          <button className="text-gray-600 hover:text-gray-900">Notes</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Practice Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4">Patient Growth</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Patient Growth Chart Placeholder</p>
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  <button 
                    className={`px-4 py-2 rounded ${selectedChart === 'weekly' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                    onClick={() => setSelectedChart('weekly')}
                  >
                    Weekly
                  </button>
                  <button 
                    className={`px-4 py-2 rounded ${selectedChart === 'monthly' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                    onClick={() => setSelectedChart('monthly')}
                  >
                    Monthly
                  </button>
                  <button 
                    className={`px-4 py-2 rounded ${selectedChart === 'yearly' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                    onClick={() => setSelectedChart('yearly')}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4">Common Diagnoses</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Diagnoses Chart Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };
  
  const renderDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
            <div className="text-3xl font-bold text-primary">{stats.todayAppointments}</div>
            <p className="text-sm text-gray-500">{stats.todayAppointments - stats.yesterdayAppointments} more than yesterday</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-2">New Patients</h3>
            <div className="text-3xl font-bold text-primary">{stats.newPatients}</div>
            <p className="text-sm text-gray-500">This week</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-2">Critical Cases</h3>
            <div className="text-3xl font-bold text-destructive">{stats.criticalCases}</div>
            <p className="text-sm text-gray-500">Requires attention</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment.id}>
                  <div 
                    className={`flex cursor-pointer border-l-4 ${appointment.colorClass} pl-4 py-2 hover:bg-gray-50`}
                    onClick={() => handleAppointmentClick(appointment.id)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{appointment.time}</p>
                      <p className="text-sm text-gray-500">{appointment.day}</p>
                    </div>
                  </div>
                  
                  {showAppointmentDetails === appointment.id && (
                    <div className="mt-2 pl-6 pr-2 py-3 bg-gray-50 rounded-md text-sm">
                      <p className="font-medium mb-1">Details:</p>
                      <p className="text-gray-600 mb-2">{appointment.details}</p>
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="text-gray-600">{appointment.notes}</p>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark">
                          Edit Details
                        </button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">Patient Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded">
                <div>
                  <p className="font-medium">GAD-7 Scores</p>
                  <p className="text-sm text-gray-500">Last 7 days</p>
                </div>
                <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center relative group-hover:bg-gray-200">
                  Chart
                  <div className="absolute opacity-0 group-hover:opacity-100 top-0 right-0 mt-1 mr-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded">
                <div>
                  <p className="font-medium">Medications Adherence</p>
                  <p className="text-sm text-gray-500">Last month</p>
                </div>
                <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center relative group-hover:bg-gray-200">
                  82%
                  <div className="absolute opacity-0 group-hover:opacity-100 top-0 right-0 mt-1 mr-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded">
                <div>
                  <p className="font-medium">Appointment Attendance</p>
                  <p className="text-sm text-gray-500">Last month</p>
                </div>
                <div className="w-24 h-12 bg-gray-100 rounded-md flex items-center justify-center relative group-hover:bg-gray-200">
                  94%
                  <div className="absolute opacity-0 group-hover:opacity-100 top-0 right-0 mt-1 mr-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center">
                <span>View All Insights</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar userType="doctor" userName={doctorName} />
      
      <div className="flex flex-1">
        <Sidebar userType="doctor" />
        
        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {lastName || doctorName}</h1>
              <p className="text-gray-600">Here's your dashboard for today</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2 items-center">
              <div className="relative">
                <button className="p-2 bg-white rounded-full shadow hover:bg-gray-50 relative">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                
                {/* Dropdown for notifications */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 hidden">
                  <div className="py-2 px-4 bg-gray-50 rounded-t-md border-b">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Notifications</h3>
                      <button className="text-sm text-primary">Mark all as read</button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600'}`}>
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 px-4 border-t text-center">
                    <button className="text-sm text-primary">View all notifications</button>
                  </div>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>New Appointment</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6 bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'patients' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('patients')}
            >
              Patients
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
          
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

