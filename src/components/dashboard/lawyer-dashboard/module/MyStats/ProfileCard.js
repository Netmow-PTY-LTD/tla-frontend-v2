import PencilIcon from "@/assets/icon";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const ProfileCard = () => {
  return (
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
          Hossain Mishu{" "}
          <button aria-label="Edit Name" className="ml-3 rounded ">
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </button>
        </h1>
        <h1 className="font-medium  flex items-center">
          Personal Details{" "}
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
            About Description{" "}
            <button aria-label="Edit Name" className="ml-3 rounded ">
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </button>
          </h1>
          <div className="p-3 bg-[#F3F3F3] mt-5 rounded-lg ">
            <p>
              If you're facing a divorce, it's crucial to seek professional
              legal advice. Our consultations cover everything from asset
              division to child custody arrangements, ensuring you understand
              your rights and options.
            </p>
          </div>
        </div>
        <hr className="tet-[#F3F3F3] border" />
        <div className="space-y-4 my-5">
          <h1 className="font-medium  flex items-center">
            Professional Details{" "}
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
  );
};

export default ProfileCard;
