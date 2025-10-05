import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p className="text-gray-300">Data ingestion controls, stats and admin tools will live here.</p>
      </div>
    </div>
  );
};

export default AdminPage;
