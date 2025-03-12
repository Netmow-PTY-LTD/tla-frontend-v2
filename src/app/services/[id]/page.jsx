import FamilyLawCard from "@/components/main/common/card/FamilyLawCard";
import ServiceDetailsCard from "@/components/main/common/card/ServiceDetailsCard";
import MainLayout from "@/components/main/common/layout";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const SingleServiceDetailsPage = async ({ params }) => {
  const { id } = await params;

  return (
    <MainLayout>
      <section className="mx-4 lg:mx-[212px] my-[58px]">
        <div>
          <ServiceDetailsCard />
        </div>

        <div className="mt-[132px] ">
          <div className="text-center">
            <h1 className="font-bold  text-2xl lg:text-4xl mt-5">
              Common Family Law Issues & Solutions
            </h1>
            <p className="text-[#34495E] mb-10">
              Finding legal help has never been simpler. Whether you're looking
              for a lawyer or offering legal services, The Law App streamlines
              the process in just three steps:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-[30px] ">
            <FamilyLawCard />
            <FamilyLawCard />
            <FamilyLawCard />
            <FamilyLawCard />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SingleServiceDetailsPage;
