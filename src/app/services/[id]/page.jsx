import FamilyLawCard from "@/components/main/common/card/FamilyLawCard";
import ServiceDetailsCard from "@/components/main/common/card/ServiceDetailsCard";
import MainLayout from "@/components/main/common/layout";
import SectionHeading from "@/components/main/home/SectionHeading";
import WorkingSteps from "@/components/main/WorkingSteps";

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
          {/* <div className="text-center">
            <h1 className="font-bold  text-2xl lg:text-4xl mt-5">
              Common Family Law Issues & Solutions
            </h1>
            <p className="text-[#34495E] mb-10">
              Finding legal help has never been simpler. Whether you're looking
              for a lawyer or offering legal services, The Law App streamlines
              the process in just three steps:
            </p>
          </div> */}

          <SectionHeading
            title="Common Family Law Issues & Solutions"
            paragraph="Finding legal help has never been simpler. Whether you're looking
              for a lawyer or offering legal services, The Law App streamlines
              the process in just three steps:"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-[30px] mt-5 lg:mt-10">
            <FamilyLawCard />
            <FamilyLawCard />
            <FamilyLawCard />
            <FamilyLawCard />
          </div>
        </div>
      </section>
      <WorkingSteps />
      <section className="home-cta">
        <div className="container">
          <div className="home-cta-content">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 lg:w-5/12">
                <div className="home-cta-text md:pr-5 lg:pr-20">
                  <h2>Take the Next Step – Get Legal Help Today!</h2>
                  <div className="cta-text">
                    <ul>
                      <li>
                        <b>For Clients: </b>Need help with family law? Post your
                        case and receive free bids from top-rated lawyers!
                      </li>
                      <li>
                        <b>For Lawyers: </b>Looking for clients in family law?
                        Join now and start receiving cases instantly!
                      </li>
                    </ul>
                  </div>
                  <div className="home-cta-button flex gap-2">
                    <Link href="/register" className="btn-brand">
                      Join as Client
                    </Link>
                    <Link href="/register" className="btn-outline">
                      Join as Lawyer
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-7/12">
                <div className="home-cta-images">
                  <div className="cta-shape"></div>
                  <img
                    src="/assets/img/cta-img.png"
                    alt="home cta"
                    className="cta-img-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SingleServiceDetailsPage;
