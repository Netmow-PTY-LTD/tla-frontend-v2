'use client';
import { Edit, Trash } from 'lucide-react';
import React from 'react';

export default function ServicesList() {
  return (
    <div className="mt-6">
      <ServiceCard
        title="Web Design & Development"
        description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam
      doloribus, ex doloremque qui illum ratione tempora numquam blanditiis
      eaque voluptatibus!"
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}

const ServiceCard = ({ title, description, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};
