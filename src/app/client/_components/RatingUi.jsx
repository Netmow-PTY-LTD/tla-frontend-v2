
"use client"
import { Star } from "lucide-react";
import RatingForm from "../dashboard/my-cases/_components/RatingForm";


const RatingUI = ({ singleResponse }) => {
  // Function to render star icons based on rating value
  console.log('singleResponse',singleResponse)
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={18}
        className={`${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <>
      {singleResponse?.leadId?.isHired ? (
        <>
          {singleResponse?.clientRating ? (
            <div className="flex items-center gap-2">
              {/* Show rating stars */}
              <div className="flex">{renderStars(singleResponse?.clientRating?.rating)}</div>
              {/* Show numeric value beside stars */}
              <span className="text-sm text-gray-600">
                ({singleResponse?.clientRating?.rating})
              </span>
            </div>
          ) : (
            <RatingForm response={singleResponse} />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default RatingUI;
