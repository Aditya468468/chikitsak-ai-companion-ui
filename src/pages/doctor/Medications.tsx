import React, { useEffect, useState } from 'react';

const Medications = () => {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    // Replace with your backend or mock API
    fetch('/api/medications')
      .then((res) => res.json())
      .then((data) => setMeds(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Medications</h1>
      {meds.map((med: any, index: number) => (
        <div key={index} className="border p-2 rounded mb-2">
          <h2 className="text-xl font-semibold">{med.name}</h2>
          <p><strong>Usage:</strong> {med.usage}</p>
          <p><strong>Dosage:</strong> {med.dosage}</p>
          <p><strong>Side Effects:</strong> {med.sideEffects}</p>
        </div>
      ))}
    </div>
  );
};

export default Medications;
