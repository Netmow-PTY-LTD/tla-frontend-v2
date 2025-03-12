import Image from "next/image";
import React from "react";

const FamilyLawCard = () => {
  return (
    <div className="card max-w-sm mx-auto p-5 sm:p-6 bg-[#EDF0F4]   border-[#DCE2EA] rounded-lg ">
      <figure className="w-16 h-16 flex-shrink-0">
        <Image
          src={"/assets/img/services/img1.png"}
          alt="law-picture"
          height={64}
          width={64}
          className="w-full h-full object-contain rounded-lg"
        />
      </figure>
      <div className="card-body text-center sm:text-left">
        <h1 className="text-lg sm:text-xl font-medium text-[#0B1C2D]">
          Divorce & Separation
        </h1>
        <p className="text-sm sm:text-base text-[#34495E]">
          Legal guidance for fair settlements and smooth legal proceedings.
        </p>
      </div>
    </div>
  );
};

export default FamilyLawCard;
