import React from 'react';
import CollaborationEmbed from '../components/collaboration/CollaborationEmbed';

const Collaboration = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Espacio Colaborativo
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <CollaborationEmbed />
      </div>
    </div>
  );
};

export default Collaboration;