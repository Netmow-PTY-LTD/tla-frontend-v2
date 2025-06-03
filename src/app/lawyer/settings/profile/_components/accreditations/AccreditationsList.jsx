'use client';

import AccreditionCard from './AccreditionCard';

export default function AccreditionsList({ profile, handleEditClick }) {
  return (
    <div className="mt-5 space-y-4">
      {profile?.accreditation &&
        profile?.accreditation?.length > 0 &&
        profile?.accreditation?.map((accreditation, i) => (
          <AccreditionCard
            accreditation={accreditation}
            key={i}
            handleEditClick={handleEditClick}
          />
        ))}
    </div>
  );
}
