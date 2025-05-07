import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const LawCard = ({ service }) => {
  return (
    <Link href={`/services/${service?.slug}`}>
      <div className="law-card ">
        <figure className="relative h-[277px]">
          <Image
            alt={service.serviceName}
            src={service?.image?.url}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            className="rounded-xl"
            style={{
              objectFit: 'cover', // cover, contain, none
            }}
          />
        </figure>
        <div className="card-body bg-[#EDF0F4] mt-2 rounded-xl p-3 sm:p-4 ">
          <div className="flex justify-between items-center gap-2">
            <p>
              {' '}
              <span className="text-[#34495E] ">Case Listed:</span>{' '}
              <span className="font-semibold">
                {service?.caseListed ? service?.caseListed : 0}{' '}
              </span>
            </p>
            <p>
              {' '}
              <span className="text-[#34495E] ">Lawyer Available:</span>{' '}
              <span className="font-semibold">
                {service?.lawyerAvailable ? service?.lawyerAvailable : 0}{' '}
              </span>
            </p>
          </div>
          <h1 className="card-title font-medium sm:text-2xl text-[27px] mt-2 ">
            {service?.serviceName}{' '}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default LawCard;
