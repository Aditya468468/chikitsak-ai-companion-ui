import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Simple implementation of Card component
const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

// Simple Navbar implementation
const Navbar = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-blue-600">HealthTrack</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              Dashboard
            </button>
            <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              Profile
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Simple Sidebar implementation
const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Health Analytics", icon: "📈", active: true },
    { name: "Appointments", icon: "📅" },
    { name: "Medications", icon: "💊" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="h-full px-3 py-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

const initialData = [
  { date: "Jan", weight: 70, bloodPressure: 120, sleep: 7 },
  { date: "Feb", weight: 71, bloodPressure: 118, sleep: 7.5 },
  { date: "Mar", weight: 70.5, bloodPressure: 122, sleep: 6.5 },
  { date: "Apr", weight: 69.8, bloodPressure: 119, sleep: 8 },
];

export default function HealthAnalytics() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(initialData);
  const [newEntry, setNewEntry] = useState({
    date: "",
    weight: "",
    bloodPressure: "",
    sleep: ""
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Simulate authentication loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: name === "date" ? value : parseFloat(value) || ""
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.date || !newEntry.weight || !newEntry.bloodPressure || !newEntry.sleep) {
      alert("Please fill all fields");
      return;
    }
    
    setHealthData(prev => [...prev, newEntry]);
    setNewEntry({ date: "", weight: "", bloodPressure: "", sleep: "" });
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Health Analytics</h1>
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isFormOpen ? "Close Form" : "Add New Entry"}
            </button>
          </div>

          {isFormOpen && (
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Add Health Data</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Month</label>
                    <input
                      type="text"
                      name="date"
                      placeholder="e.g., May"
                      value={newEntry.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      placeholder="e.g., 70.5"
                      value={newEntry.weight}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                    <input
                      type="number"
                      name="bloodPressure"
                      placeholder="e.g., 120"
                      value={newEntry.bloodPressure}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sleep (hours)</label>
                    <input
                      type="number"
                      name="sleep"
                      placeholder="e.g., 7.5"
                      value={newEntry.sleep}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Weight Tracking</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Recent Entries:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-right">Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthData.slice(-5).map((entry, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{entry.date}</td>
                          <td className="text-right">{entry.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Blood Pressure</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bloodPressure"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Recent Entries:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-right">BP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthData.slice(-5).map((entry, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{entry.date}</td>
                          <td className="text-right">{entry.bloodPressure}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Sleep Pattern</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="#ffc658"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Recent Entries:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-right">Sleep (hrs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthData.slice(-5).map((entry, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{entry.date}</td>
                          <td className="text-right">{entry.sleep}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Health Overview</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Weight Trend</h4>
                  {healthData.length >= 2 && (
                    <p>
                      {healthData[healthData.length - 1].weight > healthData[healthData.length - 2].weight 
                        ? "⬆️ Your weight has increased since last entry. " 
                        : healthData[healthData.length - 1].weight < healthData[healthData.length - 2].weight
                          ? "⬇️ Your weight has decreased since last entry. "
                          : "➡️ Your weight remains stable. "}
                      Current: {healthData[healthData.length - 1].weight} kg
                    </p>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Blood Pressure Status</h4>
                  {healthData.length >= 1 && (
                    <p>
                      {healthData[healthData.length - 1].bloodPressure > 130
                        ? "⚠️ Blood pressure is above recommended levels."
                        : healthData[healthData.length - 1].bloodPressure < 90
                          ? "⚠️ Blood pressure is below recommended levels."
                          : "✅ Blood pressure is within normal range."}
                    </p>
                  )}
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Sleep Health</h4>
                  {healthData.length >= 1 && (
                    <p>
                      {healthData[healthData.length - 1].sleep < 6
                        ? "⚠️ You might need more sleep for optimal health."
                        : healthData[healthData.length - 1].sleep > 9
                          ? "ℹ️ You're sleeping more than average."
                          : "✅ Your sleep duration is within recommended range."}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
