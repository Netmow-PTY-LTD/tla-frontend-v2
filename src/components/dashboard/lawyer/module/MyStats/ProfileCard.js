import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProfileCard = () => {
  return (
    // figma base
    <Card>
      <div className="p-3 space-y-5">
        <figure className="w-20 h-20 rounded-full overflow-hidden">
          <Image
            src="/assets/img/auth-step1.png"
            alt="User profile picture"
            width={80}
            height={80}
            priority
            className="rounded-full object-cover"
          />
        </figure>
        <h1 className="font-medium text-xl flex items-center">
          Hossain Mishu{' '}
          <button aria-label="Edit Name" className="ml-3 rounded ">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <h1 className="font-medium  flex items-center">
          Personal Details{' '}
          <button aria-label="Edit Name" className="ml-3 rounded ">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>

        <div className="space-y-4 text-[#34495E] ">
          <p> Phone: (480) 123456789 Verified</p>
          <p> Email: yourmail@example.com</p>
          <p> Address: Cedar Boulevard, Lakeside, Florida 32123</p>
        </div>
        <hr className="tet-[#F3F3F3] border" />
      </div>
      <div className="mt-5 p-3">
        <div className="mb-4">
          <h1 className="font-medium  flex items-center">
            About Description{' '}
            <button aria-label="Edit Name" className="ml-3 rounded ">
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </button>
          </h1>
          <div className="p-3 bg-[#F3F3F3] mt-5 rounded-lg ">
            <p>
              {`If you're facing a divorce, it's crucial to seek professional
              legal advice. Our consultations cover everything from asset
              division to child custody arrangements, ensuring you understand
              your rights and options.`}
            </p>
          </div>
        </div>
        <hr className="tet-[#F3F3F3] border" />
        <div className="space-y-4 my-5">
          <h1 className="font-medium  flex items-center">
            Professional Details{' '}
            <button aria-label="Edit Name" className="ml-3 rounded ">
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </button>
          </h1>
          <p>Company Name: Netmow Au</p>
          <p>Company Address: 2464 Royal Ln. Mesa, New Jersey 45463</p>
          <p>Website URL: www.netmow.com.au</p>
        </div>
      </div>
    </Card>

    // alternative design
    // <Card className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-5">
    //   {/* Profile Section */}
    //   <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-5">
    //     <figure className="w-24 h-24 rounded-full overflow-hidden">
    //       <Image
    //         src="/assets/img/auth-step1.png"
    //         alt="User profile picture"
    //         width={96}
    //         height={96}
    //         priority
    //         className="rounded-full object-cover"
    //       />
    //     </figure>
    //     <div className="text-center sm:text-left mt-4 sm:mt-0">
    //       <h1 className="font-semibold text-2xl flex items-center justify-center sm:justify-start">
    //         Hossain Mishu
    //         <button
    //           aria-label="Edit Name"
    //           className="ml-3 p-1 rounded-full hover:bg-gray-200 transition"
    //         >
    //           <PencilIcon className="w-5 h-5 text-gray-500 hover:text-black" />
    //         </button>
    //       </h1>
    //     </div>
    //   </div>

    //   {/* Personal Details */}
    //   <div className="mt-6 space-y-4 text-gray-700">
    //     <h2 className="font-medium flex items-center">
    //       Personal Details
    //       <button
    //         aria-label="Edit Personal Details"
    //         className="ml-3 p-1 rounded-full hover:bg-gray-200 transition"
    //       >
    //         <PencilIcon className="w-5 h-5 text-gray-500 hover:text-black" />
    //       </button>
    //     </h2>
    //     <p>
    //       <strong>Phone:</strong> (480) 123456789 Verified
    //     </p>
    //     <p>
    //       <strong>Email:</strong> yourmail@example.com
    //     </p>
    //     <p>
    //       <strong>Address:</strong> Cedar Boulevard, Lakeside, Florida 32123
    //     </p>
    //   </div>

    //   <hr className="my-5 border-gray-300" />

    //   {/* About Description */}
    //   <div>
    //     <h2 className="font-medium flex items-center">
    //       About Description
    //       <button
    //         aria-label="Edit About"
    //         className="ml-3 p-1 rounded-full hover:bg-gray-200 transition"
    //       >
    //         <PencilIcon className="w-5 h-5 text-gray-500 hover:text-black" />
    //       </button>
    //     </h2>
    //     <div className="p-4 bg-gray-100 mt-3 rounded-lg">
    //       <p>
    //         If you're facing a divorce, it's crucial to seek professional legal
    //         advice. Our consultations cover everything from asset division to
    //         child custody arrangements, ensuring you understand your rights and
    //         options.
    //       </p>
    //     </div>
    //   </div>

    //   <hr className="my-5 border-gray-300" />

    //   {/* Professional Details */}
    //   <div>
    //     <h2 className="font-medium flex items-center">
    //       Professional Details
    //       <button
    //         aria-label="Edit Professional Details"
    //         className="ml-3 p-1 rounded-full hover:bg-gray-200 transition"
    //       >
    //         <PencilIcon className="w-5 h-5 text-gray-500 hover:text-black" />
    //       </button>
    //     </h2>
    //     <div className="mt-3 space-y-2 text-gray-700">
    //       <p>
    //         <strong>Company Name:</strong> Netmow Au
    //       </p>
    //       <p>
    //         <strong>Company Address:</strong> 2464 Royal Ln. Mesa, New Jersey
    //         45463
    //       </p>
    //       <p>
    //         <strong>Website URL:</strong>{" "}
    //         <Link
    //           href="https://www.netmow.com.au"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="text-blue-600 hover:underline"
    //         >
    //           www.netmow.com.au
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </Card>
  );
};

export default ProfileCard;
