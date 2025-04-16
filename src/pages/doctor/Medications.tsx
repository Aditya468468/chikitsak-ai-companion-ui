import React, { useState } from "react";

const Medications = () => {
  const [medications, setMedications] = useState([
    {
      patient: "Aarav Sharma",
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice a day",
      notes: "After meals",
    },
    {
      patient: "Ishita Verma",
      name: "Amoxicillin",
      dosage: "250mg",
      frequency: "Thrice a day",
      notes: "Take with food",
    },
    {
      patient: "Rohan Mehta",
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "Once a day",
      notes: "Take only if there's pain",
    },
    {
      patient: "Neha Joshi",
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "Before sleeping",
      notes: "Avoid driving",
    },
    {
      patient: "Karan Kapoor",
      name: "Omeprazole",
      dosage: "20mg",
      frequency: "Once before breakfast",
      notes: "Empty stomach",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
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
      <h1 className="text-4xl font-bold mb-6 text-center text-sky-700 drop-shadow-lg">
        🩺 Doctor's Medications
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          + Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 border border-sky-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              👤 {med.patient}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>💊 Medicine:</strong> {med.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>📏 Dosage:</strong> {med.dosage}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>⏰ Frequency:</strong> {med.frequency}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>📝 Notes:</strong> {med.notes}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md shadow-2xl border border-sky-300 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-sky-600 text-center">
              Add New Medication
            </h2>

            <div className="space-y-4">
              <input
                name="patient"
                placeholder="Patient Name"
                value={form.patient}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                name="name"
                placeholder="Medicine Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                name="dosage"
                placeholder="Dosage (e.g., 500mg)"
                value={form.dosage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                name="frequency"
                placeholder="Frequency (e.g., Twice a day)"
                value={form.frequency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <textarea
                name="notes"
                placeholder="Additional Notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              ></textarea>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;
