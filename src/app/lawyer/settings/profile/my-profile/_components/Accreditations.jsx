import React from 'react';
import AddAccreditationsModal from './accreditations/AddAccreditationsModal';
import AccreditationsList from './accreditations/AccreditationsList';

export default function Accreditations() {
  return (
    <div>
      <h2 className="font-bold text-lg">Accreditations</h2>
      <div className="flex flex-col gap-3">
        <AccreditationsList />
        <AddAccreditationsModal />
      </div>
    </div>
  );
}
