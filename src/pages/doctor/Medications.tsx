import React, { useState } from "react";

const Medications = () => {
  const [showModal, setShowModal] = useState(false);
  const [medications, setMedications] = useState([
    {
      patient: "Aarav Sharma",
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice a day",
      notes: "After meals",
    },
    {
      patient: "Neha Joshi",
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "Before sleeping",
      notes: "Avoid driving",
    },
  ]);
  const [form, setForm] = useState({
    patient: "",
    name: "",
    dosage: "",
    frequency: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setMedications([...medications, form]);
    setForm({ patient: "", name: "", dosage: "", frequency: "", notes: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Medications</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition"
        >
          + Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-1">{med.patient}</h2>
            <p className="text-sm text-gray-600"><strong>Medicine:</strong> {med.name}</p>
            <p className="text-sm text-gray-600"><strong>Dosage:</strong> {med.dosage}</p>
            <p className="text-sm text-gray-600"><strong>Frequency:</strong> {med.frequency}</p>
            <p className="text-sm text-gray-600"><strong>Notes:</strong> {med.notes}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl animate-fadeIn border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Medication</h2>
            <input
              name="patient"
              placeholder="Patient Name"
              value={form.patient}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              name="name"
              placeholder="Medicine Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              name="dosage"
              placeholder="Dosage"
              value={form.dosage}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              name="frequency"
              placeholder="Frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-sm"
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
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
                onClick={handleAdd}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add
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

export default Medications;
