import Image from "next/image";
import Link from "next/link";
import React from "react";

const LawCard = ({ service }) => {
  return (
    <Link href={`/services/${service._id}`}>
      <div className="law-card max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
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
        <div className="card-body bg-[#EDF0F4] mt-2 rounded-xl p-3 sm:p-4 ">
          <div className="flex justify-between items-center gap-2">
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
          <h1 className="card-title font-medium sm:text-2xl text-[27px] mt-2 ">
            {service?.lawName}{" "}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default LawCard;
