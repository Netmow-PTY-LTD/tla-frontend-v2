import LawCard from "@/components/main/common/card/LawCard";
import MainLayout from "@/components/main/common/layout";
import SectionHeading from "@/components/main/home/SectionHeading";
import WorkingSteps from "@/components/main/WorkingSteps";
import { lawServices } from "@/data/data";

const ServicesPage = () => {
  return (
    <MainLayout>
      <section className="bg-[url('/assets/img/services/service-bg.png')]  pt-12 mb-20 ">
        {/* <div className="service-intro text-center mb-10 ">
          <button className="bg-[#FF8602] py-1 px-5 rounded-[82px] font-medium  text-base">
            Our Services
          </button>
          <h1 className="text-[#34495E] font-bold text-4xl mt-5">
            Find From Wide Range of Legal Services
          </h1>
        </div> */}
        <div className="container">
          <SectionHeading
            title="Find From Wide Range of Legal Services"
            subtitle="Our Services"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5 lg:mt-8">
            {lawServices?.map((service) => (
              <LawCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </section>
      <WorkingSteps />
    </MainLayout>
  );
};

export default ServicesPage;
