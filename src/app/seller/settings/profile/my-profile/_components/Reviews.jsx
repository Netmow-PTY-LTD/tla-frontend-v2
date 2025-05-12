import React from 'react';
import ReviewDetails from './reviews/ReviewDetails';

export default function Reviews() {
  return (
    <div>
      <h2 className="font-bold text-lg">Reviews</h2>
      <div className="flex flex-col gap-3">
        <ReviewDetails />
      </div>
    </div>
  );
}
