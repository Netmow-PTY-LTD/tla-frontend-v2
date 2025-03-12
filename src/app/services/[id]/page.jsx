import MainLayout from "@/components/main/common/layout";
import Image from "next/image";
import React from "react";

const SingleServiceDetailsPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <div className="text-center lg:text-left lg:w-1/2 px-4">
          <button className="bg-[#F3F3F3] py-1 px-5 rounded-[82px] font-medium flex items-center mx-auto lg:mx-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11.03 8.53a.75.75 0 1 0-1.06-1.06l-4 4a.75.75 0 0 0 0 1.06l4 4a.75.75 0 1 0 1.06-1.06l-2.72-2.72H18a.75.75 0 0 0 0-1.5H8.31z"
              />
            </svg>{" "}
            <span className="ml-1"> Family Law</span>
          </button>
          <h1 className="font-bold text-2xl lg:text-4xl align-middle my-5">
            Family Law Services – Expert Legal Help for Your Family Matters
          </h1>
          <p className="align-middle text-[#34495E] mb-10">
            Family law covers legal matters related to family relationships,
            including marriage, divorce, child custody, and financial support.
            Whether you're seeking legal protection, mediation, or court
            representation, having an experienced family lawyer by your side
            ensures your rights are protected and the best outcome is achieved.
          </p>
          <button className="bg-[#00C3C0] rounded-lg p-5 font-bold text-[#0B1C2D]">
            Get Family Lawyers Today
          </button>
        </div>
        <figure className="mt-6 lg:mt-0 lg:w-1/2">
          <Image
            alt="law-picture"
            src="/assets/img/services/img1.png"
            width={1200}
            height={800}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </figure>
      </div>
    </MainLayout>
  );
};

export default SingleServiceDetailsPage;
