import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HealthSummary, defaultMetrics } from "@/components/ui/HealthSummary";
import { ActionButton } from "@/components/ui/ActionButton";
import { Link } from "react-router-dom";
import { 
  Heart, Stethoscope, MessagesSquare, ShieldAlert, LifeBuoy, 
  Plus, Calendar, Pills, Bell, Clipboard, Activity, TrendingUp, Award
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export default function PatientDashboard() {
  // Use authentication hook to ensure user is logged in
  const { user, isAuthenticated } = useRequireAuth("patient");
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(78);
  const [notifications, setNotifications] = useState([]);
  const [achievementProgress, setAchievementProgress] = useState(65);
  
  // Get user name from metadata if available
  const firstName = user?.user_metadata?.first_name || "Patient";
  const lastName = user?.user_metadata?.last_name || "";
  const userName = `${firstName} ${lastName}`.trim();
  
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  
  // Format today's date
  const getTodayDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  // Mock fetching user data
  useEffect(() => {
    if (isAuthenticated) {
      // Simulate API calls
      setTimeout(() => {
        // Mock notifications
        setNotifications([
          { id: 1, type: 'medication', message: 'Remember to take Amoxicillin at 2:00 PM', time: '30 minutes ago' },
          { id: 2, type: 'appointment', message: 'Dr. Sarah Wilson confirmed your appointment', time: '2 hours ago' },
          { id: 3, type: 'lab', message: 'Your blood work results are now available', time: '1 day ago' },
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);
  
  // Weather API integration mockup
  const [weather, setWeather] = useState({ temp: "72°F", condition: "Sunny", pollen: "Moderate" });
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-primary font-medium">Loading your health dashboard...</p>
      </div>
    </div>;
  }
  
  // Calculate days since last checkup (mock data)
  const daysSinceCheckup = 42;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar userType="patient" userName={userName} />
      
      <div className="flex flex-1">
        <Sidebar userType="patient" />
        
        <main className="flex-1 px-4 pb-12 pt-6 md:px-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header with greeting and date */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">{getGreeting()}, {firstName}</h1>
                <p className="text-gray-600">Today is {getTodayDate()}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center bg-white p-3 rounded-lg shadow-sm">
                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                  {weather.condition === "Sunny" ? 
                    <span className="text-xl">☀️</span> : 
                    <span className="text-xl">⛅</span>}
                </div>
                <div>
                  <p className="font-medium">{weather.temp}, {weather.condition}</p>
                  <p className="text-sm text-gray-500">Pollen: {weather.pollen}</p>
                </div>
              </div>
            </div>
            
            {/* Notification banner */}
            {daysSinceCheckup > 30 && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      It's been {daysSinceCheckup} days since your last checkup. Consider scheduling a routine visit.
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Link to="/patient/appointments/new" className="text-sm font-medium text-amber-700 hover:text-amber-600">
                      Schedule Now
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Health Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-health-blue to-health-purple p-6">
                <h2 className="text-white text-2xl font-semibold mb-2">Your Health Overview</h2>
                <p className="text-white/80">Track your progress and see your health insights</p>
              </div>
              <div className="p-6">
                <HealthSummary metrics={defaultMetrics} className="mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Overall Health Score</h3>
                      <span className="text-lg font-bold text-primary">{healthScore}/100</span>
                    </div>
                    <Progress value={healthScore} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2">
                      {healthScore > 75 ? "Excellent condition!" : "Room for improvement"}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Step Goal</h3>
                      <span className="text-lg font-bold text-primary">7,342/10,000</span>
                    </div>
                    <Progress value={73} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2">
                      You're 73% to your daily goal
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Medication Adherence</h3>
                      <span className="text-lg font-bold text-primary">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2">
                      Great job staying on track!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Activity className="h-6 w-6 mr-2 text-primary" />
                Quick Actions
              </h2>
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
            
            {/* Main content grid - top row */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Appointments Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
                  </div>
                  <Link to="/patient/appointments" className="text-primary text-sm hover:underline flex items-center">
                    <span>View All</span>
                    <Plus className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="flex border-l-4 border-primary pl-4 py-2 bg-blue-50 rounded-r-md">
                    <div className="flex-1">
                      <p className="font-medium">Dr. Sarah Wilson</p>
                      <p className="text-sm text-gray-500">General Physician</p>
                      <div className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Annual Checkup
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Tomorrow</p>
                      <p className="text-sm text-gray-500">10:00 AM</p>
                      <button className="mt-1 text-xs text-primary hover:underline">Reschedule</button>
                    </div>
                  </div>
                  
                  <div className="flex border-l-4 border-health-purple pl-4 py-2">
                    <div className="flex-1">
                      <p className="font-medium">Dr. Michael Chen</p>
                      <p className="text-sm text-gray-500">Cardiologist</p>
                      <div className="mt-1 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        Follow-up
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Fri, 18 Apr</p>
                      <p className="text-sm text-gray-500">2:30 PM</p>
                      <button className="mt-1 text-xs text-primary hover:underline">Reschedule</button>
                    </div>
                  </div>
                  
                  <Link to="/patient/appointments" className="block text-center py-2 bg-gray-50 rounded-md text-gray-600 hover:bg-gray-100 text-sm transition-colors">
                    See 2 more appointments
                  </Link>
                </div>
              </div>
              
              {/* Medications Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Pills className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Your Medications</h3>
                  </div>
                  <Link to="/patient/medications" className="text-primary text-sm hover:underline">View All</Link>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-health-pink/30 flex items-center justify-center mr-4">
                      <span className="font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Amoxicillin</p>
                      <p className="text-sm text-gray-500">500mg, 3 times daily</p>
                      <div className="mt-1 text-xs text-gray-500">Next dose: Today, 2:00 PM</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                      <button className="block mt-2 text-xs text-primary hover:underline">Mark as taken</button>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-health-lightblue/30 flex items-center justify-center mr-4">
                      <span className="font-bold">P</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Paracetamol</p>
                      <p className="text-sm text-gray-500">500mg, as needed</p>
                      <div className="mt-1 text-xs text-gray-500">Last taken: Today, 9:30 AM</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                      <button className="block mt-2 text-xs text-primary hover:underline">Mark as taken</button>
                    </div>
                  </div>
                  
                  <Link to="/patient/medications" className="block text-center py-2 bg-gray-50 rounded-md text-gray-600 hover:bg-gray-100 text-sm transition-colors">
                    View medication schedule
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main content grid - bottom row */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border md:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Notifications</h3>
                  </div>
                  <button className="text-primary text-sm hover:underline">Mark all read</button>
                </div>
                
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="border-b pb-3 last:border-0">
                      <div className="flex items-start">
                        <div className={`rounded-full p-2 mr-3 ${
                          notification.type === 'medication' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'appointment' ? 'bg-purple-100 text-purple-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {notification.type === 'medication' ? <Pills className="h-4 w-4" /> :
                           notification.type === 'appointment' ? <Calendar className="h-4 w-4" /> :
                           <Clipboard className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Link to="/patient/notifications" className="block text-center py-2 bg-gray-50 rounded-md text-gray-600 hover:bg-gray-100 text-sm transition-colors">
                    View all notifications
                  </Link>
                </div>
              </div>
              
              {/* Recent Test Results */}
              <div className="bg-white rounded-xl p-6 shadow-sm border md:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Clipboard className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Recent Tests</h3>
                  </div>
                  <Link to="/patient/test-results" className="text-primary text-sm hover:underline">View All</Link>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Blood Test Results</h4>
                      <span className="text-xs text-gray-500">3 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Complete Blood Count (CBC)</p>
                    <div className="flex mt-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Normal
                      </span>
                      <Link to="/patient/test-results/12345" className="text-xs text-primary ml-auto hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Cardiac Assessment</h4>
                      <span className="text-xs text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">ECG Analysis</p>
                    <div className="flex mt-2">
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        Follow-up Required
                      </span>
                      <Link to="/patient/test-results/12346" className="text-xs text-primary ml-auto hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <Link to="/patient/test-results" className="block text-center py-2 bg-gray-50 rounded-md text-gray-600 hover:bg-gray-100 text-sm transition-colors">
                    View all test results
                  </Link>
                </div>
              </div>
              
              {/* Health Goals */}
              <div className="bg-white rounded-xl p-6 shadow-sm border md:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Health Goals</h3>
                  </div>
                  <Link to="/patient/goals" className="text-primary text-sm hover:underline">Manage</Link>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm">Daily Step Goal</h4>
                      <span className="text-sm font-medium">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">7,342 of 10,000 steps</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm">Water Intake</h4>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">4 of 8 glasses</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm">Sleep Goal</h4>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">7 of 8 hours</p>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-amber-500" />
                        <span className="font-medium text-sm">Weekly Achievement</span>
                      </div>
                      <span className="text-sm font-medium">{achievementProgress}%</span>
                    </div>
                    <Progress value={achievementProgress} className="h-2 mt-2" />
                    <p className="text-xs text-gray-500 mt-1">Keep it up! You're on track for a health badge.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Health Tip */}
            <div className="mt-8 bg-gradient-to-r from-health-lightgreen/20 to-health-lightblue/20 p-6 rounded-xl border border-health-lightblue/30">
              <h3 className="text-lg font-medium mb-2">Daily Health Tip</h3>
              <p className="text-gray-700">Regular physical activity can help reduce your risk of chronic diseases, improve your balance and coordination, and help you maintain a healthy weight.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
