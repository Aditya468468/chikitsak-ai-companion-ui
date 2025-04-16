import React, { useState, useEffect } from "react";
import { Search, Calendar, User, UserPlus, Clock, PlusCircle, X, Check, AlertTriangle, Pill, FileText, Clipboard, Edit, Trash2 } from "lucide-react";

const PrescriptionDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeTab, setActiveTab] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  
  // Sample data with more realistic prescriptions
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "PRE-001",
      patient: "Aarav Sharma",
      age: 45,
      doctor: "Dr. Ramesh Kumar",
      specialty: "Cardiologist",
      medications: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days" },
        { name: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "30 days" },
      ],
      notes: "Take after meals. Monitor blood pressure weekly.",
      status: "Filled",
      priority: "Normal",
      date: "2025-04-10",
      expiry: "2025-05-10",
    },
    {
      id: "PRE-002",
      patient: "Neha Joshi",
      age: 32,
      doctor: "Dr. Priya Yadav",
      specialty: "General Physician",
      medications: [
        { name: "Amoxicillin", dosage: "250mg", frequency: "Thrice a day", duration: "7 days" },
        { name: "Paracetamol", dosage: "500mg", frequency: "As needed", duration: "3 days" },
      ],
      notes: "Complete the full course of antibiotics. Avoid driving after taking paracetamol.",
      status: "Pending",
      priority: "High",
      date: "2025-04-14",
      expiry: "2025-04-21",
    },
    {
      id: "PRE-003",
      patient: "Rajiv Malhotra",
      age: 67,
      doctor: "Dr. Sanjay Patel",
      specialty: "Neurologist",
      medications: [
        { name: "Levetiracetam", dosage: "500mg", frequency: "Twice daily", duration: "90 days" },
        { name: "Vitamin B12", dosage: "1500mcg", frequency: "Once daily", duration: "30 days" },
      ],
      notes: "Take with food. Report any unusual drowsiness or dizziness.",
      status: "Expired",
      priority: "Normal",
      date: "2025-03-01",
      expiry: "2025-04-01",
    },
  ]);

  const defaultForm = {
    id: "",
    patient: "",
    age: "",
    doctor: "",
    specialty: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
    status: "Pending",
    priority: "Normal",
    date: new Date().toISOString().split('T')[0],
    expiry: "",
  };
  
  const [form, setForm] = useState({...defaultForm});

  useEffect(() => {
    // Generate a new prescription ID when the form is reset
    if (!form.id) {
      const newId = `PRE-${String(prescriptions.length + 1).padStart(3, '0')}`;
      setForm(prev => ({ ...prev, id: newId }));
    }
  }, [form.id, prescriptions.length]);

  const handleChange = (e, medicationIndex = null) => {
    const { name, value } = e.target;
    
    if (medicationIndex !== null) {
      const updatedMedications = [...form.medications];
      updatedMedications[medicationIndex] = {
        ...updatedMedications[medicationIndex],
        [name]: value
      };
      setForm({ ...form, medications: updatedMedications });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Auto-calculate expiry date when setting date and first medication duration
    if (name === "date" || (name === "duration" && medicationIndex === 0)) {
      const date = name === "date" ? value : form.date;
      const duration = name === "duration" ? 
        parseInt(value.match(/\d+/)?.[0] || 0) : 
        parseInt(form.medications[0]?.duration?.match(/\d+/)?.[0] || 0);
      
      if (date && duration) {
        const expiryDate = new Date(date);
        expiryDate.setDate(expiryDate.getDate() + duration);
        setForm(prev => ({ 
          ...prev, 
          expiry: expiryDate.toISOString().split('T')[0] 
        }));
      }
    }
  };

  const handleAddMedication = () => {
    setForm({ 
      ...form, 
      medications: [
        ...form.medications, 
        { name: "", dosage: "", frequency: "", duration: "" }
      ] 
    });
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...form.medications];
    updatedMedications.splice(index, 1);
    setForm({ ...form, medications: updatedMedications });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updatedPrescriptions = [...prescriptions];
      updatedPrescriptions[editIndex] = form;
      setPrescriptions(updatedPrescriptions);
      setEditIndex(null);
    } else {
      setPrescriptions([...prescriptions, form]);
    }
    
    setForm({...defaultForm});
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setForm({...prescriptions[index]});
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions.splice(deleteIndex, 1);
    setPrescriptions(updatedPrescriptions);
    setShowDeleteModal(false);
  };

  const handleChangeStatus = (index, newStatus) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index] = {
      ...updatedPrescriptions[index],
      status: newStatus
    };
    setPrescriptions(updatedPrescriptions);
  };

  // Filter and sort logic
  const filteredPrescriptions = prescriptions
    .filter(prescription => {
      const matchesSearch = 
        prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medications.some(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesTab = 
        activeTab === "all" || 
        (activeTab === "pending" && prescription.status === "Pending") ||
        (activeTab === "filled" && prescription.status === "Filled") ||
        (activeTab === "expired" && prescription.status === "Expired");
      
      const matchesFilter = 
        filterStatus === "All" || prescription.status === filterStatus;
      
      return matchesSearch && matchesTab && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "priority") {
        const priorityOrder = { "High": 0, "Normal": 1, "Low": 2 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return sortOrder === "asc"
          ? a[sortBy].localeCompare(b[sortBy])
          : b[sortBy].localeCompare(a[sortBy]);
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Filled": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600";
      case "Low": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  // Calculate stats
  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter(p => p.status === "Pending").length,
    filled: prescriptions.filter(p => p.status === "Filled").length,
    expired: prescriptions.filter(p => p.status === "Expired").length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Prescription Management</h1>
            <button
              onClick={() => {
                setForm({...defaultForm});
                setEditIndex(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition flex items-center"
            >
              <PlusCircle size={16} className="mr-2" />
              New Prescription
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FileText size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Prescriptions</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <Clock size={20} className="text-yellow-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold">{stats.pending}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Check size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Filled</p>
                <h3 className="text-2xl font-bold">{stats.filled}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <AlertTriangle size={20} className="text-red-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <h3 className="text-2xl font-bold">{stats.expired}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative flex-grow md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search prescriptions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="hidden md:block">
                <select
                  className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Filled">Filled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div>
                <select
                  className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="patient">Sort by Patient</option>
                  <option value="doctor">Sort by Doctor</option>
                </select>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 border-b border-gray-200">
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === "all" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All ({stats.total})
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === "pending" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending ({stats.pending})
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === "filled" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("filled")}
            >
              Filled ({stats.filled})
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === "expired" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("expired")}
            >
              Expired ({stats.expired})
            </button>
          </div>
        </div>

        {/* Prescriptions */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Clipboard size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setForm({...defaultForm});
                  setEditIndex(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
              >
                Add New Prescription
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.map((prescription, index) => {
              const prescriptionIndex = prescriptions.findIndex(p => p.id === prescription.id);
              
              return (
                <div
                  key={prescription.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(prescription.priority)} bg-gray-100`}>
                        {prescription.priority} Priority
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEdit(prescriptionIndex)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(prescriptionIndex)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {prescription.id}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-medium text-gray-800 mb-1 flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    {prescription.patient}
                    {prescription.age && <span className="text-sm text-gray-500 ml-2">({prescription.age} yrs)</span>}
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <UserPlus size={14} className="mr-2 text-gray-400" />
                    <span><strong>{prescription.doctor}</strong>
                    {prescription.specialty && <span className="text-gray-500"> • {prescription.specialty}</span>}
                    </span>
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>Issued: {new Date(prescription.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Expires: {new Date(prescription.expiry).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <Pill size={16} className="mr-2 text-gray-400" />
                      <h3 className="text-sm font-medium">Medications</h3>
                    </div>
                    <div className="pl-6">
                      {prescription.medications.map((med, i) => (
                        <div key={i} className="text-sm text-gray-600 mb-1">
                          <div className="font-medium">{med.name}</div>
                          <div className="text-xs text-gray-500">
                            {med.dosage}
                            {med.frequency && ` • ${med.frequency}`}
                            {med.duration && ` • ${med.duration}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {prescription.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-3">
                      <p className="text-xs font-medium mb-1 text-gray-500">Notes:</p>
                      <p>{prescription.notes}</p>
                    </div>
                  )}
                  
                  {prescription.status !== "Filled" && (
                    <div className="mt-4 flex justify-end space-x-2">
                      {prescription.status === "Pending" && (
                        <button 
                          onClick={() => handleChangeStatus(prescriptionIndex, "Filled")}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium rounded-lg transition"
                        >
                          Mark as Filled
                        </button>
                      )}
                      {prescription.status === "Expired" && (
                        <button 
                          onClick={() => handleEdit(prescriptionIndex)}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-lg transition"
                        >
                          Renew Prescription
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl animate-fadeIn border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editIndex !== null ? "Edit Prescription" : "New Prescription"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescription ID</label>
                <input
                  name="id"
                  placeholder="Prescription ID"
                  value={form.id}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  name="patient"
                  placeholder="Patient Name"
                  value={form.patient}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Name</label>
                <input
                  name="doctor"
                  placeholder="Doctor's Name"
                  value={form.doctor}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <input
                  name="specialty"
                  placeholder="Specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Medications</label>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="text-blue-600 text-sm hover:text-blue-700 hover:underline flex items-center"
                >
                  <PlusCircle size={14} className="mr-1" /> Add Medication
                </button>
              </div>
              
              {form.medications.map((med, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Medication #{idx + 1}</h4>
                    {form.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(idx)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Medicine Name</label>
                      <input
                        name="name"
                        placeholder="Medicine Name"
                        value={med.name}
                        onChange={(e) => handleChange(e, idx)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                      <input
                        name="dosage"
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) => handleChange(e, idx)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                      <input
                        name="frequency"
                        placeholder="Frequency (e.g., Twice daily)"
                        value={med.frequency}
                        onChange={(e) => handleChange(e, idx)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                      <input
                        name="duration"
                        placeholder="Duration (e.g., 7 days)"
                        value={med.duration}
                        onChange={(e) => handleChange(e, idx)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Filled">Filled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  name="expiry"
                  type="date"
                  value={form.expiry}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                placeholder="Special instructions, warnings, or other notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                {editIndex !== null ? "Update Prescription" : "Add Prescription"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl animate-fadeIn border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Delete Prescription</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this prescription? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                Delete
              </button>
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
};

export default PrescriptionDashboard;
