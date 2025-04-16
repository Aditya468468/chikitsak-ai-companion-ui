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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Medications List
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-5 border-l-4 border-blue-500"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {med.patient}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Medicine:</strong> {med.name}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Dosage:</strong> {med.dosage}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Frequency:</strong> {med.frequency}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Notes:</strong> {med.notes}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Add New Medication
            </h2>
            <input
              name="patient"
              placeholder="Patient Name"
              value={form.patient}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              name="name"
              placeholder="Medicine Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              name="dosage"
              placeholder="Dosage (e.g., 500mg)"
              value={form.dosage}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              name="frequency"
              placeholder="Frequency (e.g., Twice a day)"
              value={form.frequency}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              name="notes"
              placeholder="Additional Notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            ></textarea>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
