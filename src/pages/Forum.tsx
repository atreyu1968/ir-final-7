import React from 'react';
import ForumEmbed from '../components/forum/ForumEmbed';

const Forum = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Foro de Discusión
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ForumEmbed />
      </div>
    </div>
  );
};

export default Forum;