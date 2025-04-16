import React, { useState } from "react";

const PrescriptionDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([
    {
      patient: "Aarav Sharma",
      doctor: "Dr. Ramesh Kumar",
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "Twice a day" },
        { name: "Cetirizine", dosage: "10mg", frequency: "Before sleeping" },
      ],
      notes: "Take medications after meals.",
      status: "Filled",
      date: "2025-04-10",
    },
    {
      patient: "Neha Joshi",
      doctor: "Dr. Priya Yadav",
      medications: [
        { name: "Amoxicillin", dosage: "250mg", frequency: "Thrice a day" },
      ],
      notes: "Avoid driving after taking.",
      status: "Pending",
      date: "2025-04-14",
    },
  ]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    medications: [{ name: "", dosage: "", frequency: "" }],
    notes: "",
    status: "Pending",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    if (name === "medication") {
      const updatedMedications = [...form.medications];
      updatedMedications[index][name] = value;
      setForm({ ...form, medications: updatedMedications });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddMedication = () => {
    setForm({ ...form, medications: [...form.medications, { name: "", dosage: "", frequency: "" }] });
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, form]);
    setForm({
      patient: "",
      doctor: "",
      medications: [{ name: "", dosage: "", frequency: "" }],
      notes: "",
      status: "Pending",
      date: "",
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Prescriptions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition"
        >
          + Add Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.map((prescription, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-1">{prescription.patient}</h2>
            <p className="text-sm text-gray-600"><strong>Doctor:</strong> {prescription.doctor}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> {prescription.status}</p>
            <p className="text-sm text-gray-600"><strong>Date:</strong> {prescription.date}</p>
            <div className="mt-2">
              <strong>Medications:</strong>
              {prescription.medications.map((med, i) => (
                <div key={i} className="text-sm text-gray-600">
                  <p><strong>{med.name}</strong> - {med.dosage}, {med.frequency}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600"><strong>Notes:</strong> {prescription.notes}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl animate-fadeIn border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Prescription</h2>
            <input
              name="patient"
              placeholder="Patient Name"
              value={form.patient}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              name="doctor"
              placeholder="Doctor's Name"
              value={form.doctor}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            {form.medications.map((med, index) => (
              <div key={index} className="mb-3">
                <input
                  name="medication"
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  name="dosage"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  name="frequency"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ))}
            <button
              onClick={handleAddMedication}
              className="mb-3 text-blue-600 text-sm hover:underline"
            >
              + Add Another Medication
            </button>
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
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
                onClick={handleAddPrescription}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Prescription
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
