import Image from "next/image";
import React from "react";

const LawCard = ({ service }) => {
  console.log(service);
  return (
    <div className="law-card">
      <figure style={{ position: "relative", height: "400px" }}>
        <Image
          alt="law-picture"
          src={service?.image}
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
            <span className="font-semibold">{service?.caseListed} </span>
          </p>
          <p>
            {" "}
            <span className="text-[#34495E] ">Lawyer Available:</span>{" "}
            <span className="font-semibold">{service?.lawyerAvailable} </span>
          </p>
        </div>
        <h1 className="card-title font-medium text-[27px] mt-2 ">
          {service?.lawName}{" "}
        </h1>
      </div>
    </div>
  );
};

export default LawCard;
