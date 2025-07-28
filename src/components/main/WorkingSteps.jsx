import Image from 'next/image';
import SectionHeading from './home/SectionHeading';
import Link from 'next/link';
import { workingStepsForClients, workingStepsForLawyers } from '@/data/data';

export default function WorkingSteps() {
  return (
    <section className="working-steps">
      <div className="container">
        <SectionHeading
          title="The Law App for Professionals"
          subtitle="How It Works?"
          paragraph="Grow your practice, reduce overheads, and connect with more clients. The Law App gives you the tools to work smarter and build your brand."
        />
        <div className="working-steps-grid my-5 md:my-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workingStepsForLawyers.map((step) => (
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
        <div className="mt-16">
          <SectionHeading
            title="Get Legal Help in 3 Simple Steps"
            paragraph="Finding the right lawyer shouldn’t be complicated. With The Law App, you can connect with experienced legal professionals in just three easy steps."
          />
          <div className="working-steps-grid my-5 md:my-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {workingStepsForClients.map((step) => (
                <div className="working-step-item" key={step?.id}>
                  {step?.icon && (
                    <div className="step-icon flex justify-center items-center">
                      {step?.icon}
                    </div>
                  )}
                  <div className="working-step-number">{step?.id}</div>
                  <div className="working-step-content">
                    <h3>{step?.title}</h3>
                    <div className="working-steps-paragraph">
                      {step?.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="btn-default btn-secondary">
            Join as Lawyer - find client
          </Link>
          <Link
            href="/?clientRegister=true"
            className="btn-default btn-outline-primary"
          >
            Join as Client - post cases
          </Link>
        </div> */}
      </div>
    </section>
  );
}
