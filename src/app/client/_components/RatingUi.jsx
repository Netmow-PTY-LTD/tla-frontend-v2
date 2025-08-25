
"use client"
import { Star } from "lucide-react";






 export const RatingStars = ({ rating = 0, size = 18, max = 5, showNumber = true }) => {
  const renderStars = () => {
    return Array.from({ length: max }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={`${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex">{renderStars()}</div>
      {showNumber && (
        <span className="text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );
};







