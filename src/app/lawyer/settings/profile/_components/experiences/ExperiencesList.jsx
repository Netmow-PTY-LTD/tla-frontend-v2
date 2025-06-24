'use client';
import { Edit, Trash } from 'lucide-react';
import React from 'react';

export default function ExperiencesList({ profile, handleEditClick }) {
  console.log('ExperiencesList', profile?.experience);
  return (
    <div className="mt-6 space-y-4">
      {profile?.experience?.length > 0 &&
        profile?.experience?.map((experience, i) => (
          <ExperienceCard
            experience={experience}
            key={i}
            handleEditClick={handleEditClick}
          />
        ))}
    </div>
  );
}

const ExperienceCard = ({ experience, handleEditClick }) => {
  const { description } = experience;
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEditClick(experience)}
          >
            <Edit size={18} />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <Trash size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
