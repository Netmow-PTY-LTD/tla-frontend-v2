import Image from "next/image";
import React from "react";

const LawCard = () => {
  return (
    <div className="law-card">
      <figure style={{ position: "relative", height: "400px" }}>
        <Image
          alt="law-picture"
          src="/assets/img/services/img1.png"
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          className="rounded-xl"
          style={{
            objectFit: "cover", // cover, contain, none
          }}
        />
      </figure>
      <div className="card-body bg-[#EDF0F4] mt-2 rounded-xl p-3 ">
        <div className="flex justify-between items-center">
          <p>
            {" "}
            <span className="text-[#34495E] ">Case Listed:</span>{" "}
            <span className="font-semibold">125</span>
          </p>
          <p>
            {" "}
            <span className="text-[#34495E] ">Lawyer Available:</span>{" "}
            <span className="font-semibold">85</span>
          </p>
        </div>
        <h1 className="card-title font-medium text-[27px] mt-2 ">Family Law</h1>
      </div>
    </div>
  );
};

export default LawCard;
