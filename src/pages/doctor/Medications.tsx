import React, { useState } from "react";

const Medications = () => {
  const [medications, setMedications] = useState([
    {
      id: 1,
      patient: "Aarav Sharma",
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice a day",
      notes: "After meals",
      status: "Active"
    },
    {
      id: 2,
      patient: "Ishita Verma",
      name: "Amoxicillin",
      dosage: "250mg",
      frequency: "Thrice a day",
      notes: "Take with food",
      status: "Active"
    },
    {
      id: 3,
      patient: "Rohan Mehta",
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "Once a day",
      notes: "Take only if there's pain",
      status: "Active"
    },
    {
      id: 4,
      patient: "Neha Joshi",
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "Before sleeping",
      notes: "Avoid driving",
      status: "Active"
    },
    {
      id: 5,
      patient: "Karan Kapoor",
      name: "Omeprazole",
      dosage: "20mg",
      frequency: "Once before breakfast",
      notes: "Empty stomach",
      status: "Active"
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    id: 0,
    patient: "",
    name: "",
    dosage: "",
    frequency: "",
    notes: "",
    status: "Active"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const newMedication = {
      ...form,
      id: medications.length > 0 ? Math.max(...medications.map(med => med.id)) + 1 : 1
    };
    setMedications([...medications, newMedication]);
    setForm({ id: 0, patient: "", name: "", dosage: "", frequency: "", notes: "", status: "Active" });
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, status: med.status === "Active" ? "Inactive" : "Active" } : med
    ));
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || med.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 shadow-sm rounded-xl">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          Medical Prescriptions
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Patient medication management system</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search patient or medication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pl-10 bg-white"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute left-3 top-3">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-700"
          >
            <option value="All">All Medications</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-sm flex items-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            Add Prescription
          </button>
        </div>
      </div>

      {filteredMedications.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <path d="M9 12h6"></path>
            <path d="M12 9v6"></path>
            <path d="M12 12a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"></path>
            <path d="M12 12a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"></path>
          </svg>
          <p className="text-gray-500 mt-4">No medications found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((med) => (
            <div
              key={med.id}
              className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow transition-shadow duration-300 ${
                med.status === "Active" ? "" : "opacity-75"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  {med.patient}
                </h2>
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${
                    med.status === "Active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {med.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-1">
                    <path d="m19 14-7 7-7-7"></path>
                    <path d="M12 21V4"></path>
                    <rect width="8" height="3" x="8" y="4" rx="1"></rect>
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Medication</p>
                    <p className="text-gray-700">{med.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-1">
                    <path d="M9 12h.01"></path>
                    <path d="M15 12h.01"></path>
                    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
                    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Dosage</p>
                    <p className="text-gray-700">{med.dosage}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Frequency</p>
                    <p className="text-gray-700">{med.frequency}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-1">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Notes</p>
                    <p className="text-gray-700">{med.notes}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleStatus(med.id)}
                  className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 flex items-center text-gray-600 transition-colors duration-200"
                >
                  {med.status === "Active" ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      Deactivate
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-medium text-gray-800">
                Add New Prescription
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Patient Name</label>
                <input
                  name="patient"
                  placeholder="Enter full name"
                  value={form.patient}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Medication Name</label>
                <input
                  name="name"
                  placeholder="Enter medication name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">Dosage</label>
                  <input
                    name="dosage"
                    placeholder="e.g., 500mg"
                    value={form.dosage}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">Frequency</label>
                  <input
                    name="frequency"
                    placeholder="e.g., Twice a day"
                    value={form.frequency}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  placeholder="Additional instructions..."
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  rows="3"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.patient || !form.name || !form.dosage || !form.frequency}
                className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 ${
                  !form.patient || !form.name || !form.dosage || !form.frequency ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Add Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} Medical Prescription System</p>
      </div>
    </div>
  );
};

export default Medications;
