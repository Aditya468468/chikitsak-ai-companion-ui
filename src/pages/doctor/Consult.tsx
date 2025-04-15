import React, { useState } from 'react';

const Consult = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your backend API endpoint
    const res = await fetch('/api/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Consult a Doctor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your symptoms..."
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {response && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <strong>Doctor says:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default Consult;
