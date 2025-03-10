import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Image from "next/image";

export default function HomeServices() {
  const sectionHeading = {
    title: "Quick Lawyer & Unlimited Cases",
    subtitle: "Find From Wide Range of Legal Services",
    paragraph:
      "From family law and property disputes to business contracts and criminal defense, The Law App connects you with qualified lawyers across various legal fields. Post your case, compare bids, and choose the right lawyer—all in one place.",
  };

  const data = [
    {
      id: 1,
      title: "Property Law",
      icon: "/assets/img/service-1.png",
    },
    {
      id: 2,
      title: "Taxation Law",
      icon: "/assets/img/service-2.png",
    },
    {
      id: 3,
      title: "Will & Estate",
      icon: "/assets/img/service-3.png",
    },
    {
      id: 4,
      title: "Child Law",
      icon: "/assets/img/service-4.png",
    },
    {
      id: 5,
      title: "Traffic Law",
      icon: "/assets/img/service-5.png",
    },
    {
      id: 6,
      title: "Criminal Law",
      icon: "/assets/img/service-6.png",
    },
    {
      id: 7,
      title: "Cyber Law",
      icon: "/assets/img/service-7.png",
    },
  ];

  return (
    <section className="home-services">
      <div className="container-lg">
        <SectionHeading
          title={sectionHeading.title}
          subtitle={sectionHeading.subtitle}
          paragraph={sectionHeading.paragraph}
        />

        <div className="flex flex-wrap xl:flex-nowrap justify-between gap-5 w-full mt-10 suggestion-area">
          {data.map((item) => (
            <Link
              href="#"
              className="flex flex-col items-center gap-3 text-center"
              key={item.id}
            >
              <Image
                src={item.icon}
                width={180}
                height={180}
                className="object-cover rounded-lg"
                alt={item.title}
              />
              <h5>{item.title}</h5>
            </Link>
          ))}
        </div>
        <div className="flex justify-center gap-5 mt-10">
          <Link href="/services" className="btn-brand">
            Get Started - Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
