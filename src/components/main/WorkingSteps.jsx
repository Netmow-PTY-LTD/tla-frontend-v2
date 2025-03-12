import Image from "next/image";
import SectionHeading from "./home/SectionHeading";
import Link from "next/link";

export default function WorkingSteps() {
  const workingSteps = [
    {
      id: 1,
      image: "/assets/img/step-1.png",
      title: "Choose a Lawyer",
      description:
        "Select the legal category that fits your needs, whether it’s family law, real estate, business contracts, or any other area of law.",
    },
    {
      id: 2,
      image: "/assets/img/step-2.png",
      title: "Provide Your Details",
      description:
        "Share a brief description of your legal issue or requirements. The more details you provide, the better we can match you with the right lawyer.",
    },
    {
      id: 3,
      image: "/assets/img/step-3.png",
      title: "Find the Best Match",
      description:
        "Receive multiple bids from verified lawyers, compare their expertise, reviews, and pricing, and hire the one that best fits your needs and budget.",
    },
  ];
  return (
    <section className="working-steps">
      <div className="container">
        <SectionHeading
          title="Get Legal Help in 3 Simple Steps"
          subtitle="How It Works?"
          paragraph="Finding the right lawyer shouldn't be complicated. With The Law App, you can connect with experienced legal professionals in just three easy steps."
        />
        <div className="working-steps-grid my-5 md:my-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workingSteps.map((step) => (
              <div className="working-step-item" key={step?.id}>
                <div className="working-step-number">{step?.id}</div>
                <div className="working-step-content">
                  <h3>{step?.title}</h3>
                  <div className="working-steps-paragraph">
                    {step?.description}
                  </div>
                  <Image src={step?.image} alt="" width={438} height={231} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="btn-brand">
            Join as Lawyer - find client
          </Link>
          <Link href="/register" className="btn-outline">
            Join as Client - post cases
          </Link>
        </div>
      </div>
    </section>
  );
}
