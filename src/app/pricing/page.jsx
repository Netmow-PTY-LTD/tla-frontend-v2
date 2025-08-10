import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import Image from 'next/image';
import Link from 'next/link';

const PricingPage = () => {
  return (
    <MainLayout>
      <section className="pricing-banner section">
        <div className="container">
          <div className="pricing-banner-content flex flex-wrap bg-[var(--secondary-color)] rounded-[30px] overflow-hidden">
            <div className="p-[20px] md:p-[50px] w-full md:w-[calc(100%-356px)] flex flex-col justify-center items-start gap-[30px]">
              <h1 className="text-white">Pricing</h1>
              <p className="text-white">
                From the moment you sign up, we’ll start sending you cases —
                completely free. You only pay when you choose to contact the
                customers that are right for your business.
              </p>

              <Link href="/register" className="btn-default btn-primary">
                Join as a Lawyer
              </Link>
            </div>
            <div className="w-full md:max-w-[356px] hidden md:block">
              <Image
                src="/assets/img/circle.png"
                width={356}
                height={353}
                alt="banner shape"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-7/12">
              <div className="image-container">
                <Image
                  src="/assets/img/visacard.png"
                  width={750}
                  height={375}
                  alt="Visa Card"
                  className="w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-5/12 mt-10 md:mt-0">
              <h2 className="section-title">
                Get Started with Simple <br /> Credits{' '}
                <span className="line-sm mr-1" /> <span className="line-lg" />
              </h2>
              <div className="text-[var(--color-black)] mt-4">
                Buy a credit pack and use your credits to reach out to the
                customers you want—<b>no commissions, no hidden fees,</b> just
                straightforward connections.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-7/12">
              <h2 className="section-title flex item-center">
                You're in control
                <span className="line-sm mr-1 ml-5" />{' '}
                <span className="line-lg" />
              </h2>
              <div className="text-[var(--color-black)] mt-4">
                Decide which cases to pursue with clear, upfront pricing — so
                you always know what you're spending.
              </div>
            </div>
            <div className="w-full md:w-5/12 mt-10 md:mt-0">
              <div className="image-container">
                <Image
                  src="/assets/img/pricing-leads.png"
                  width={750}
                  height={375}
                  alt="Visa Card"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="max-w-[1025px] mx-auto flex flex-wrap items-center">
            <div className="w-full md:w-5/12">
              <div className="image-container">
                <Image
                  src="/assets/img/pricing-medal.png"
                  width={265}
                  height={295}
                  alt="Medal"
                  className=""
                />
              </div>
            </div>
            <div className="w-full md:w-7/12 mt-10 md:mt-0">
              <h2 className="section-title">
                New business guaranteed <br />
                <span className="line-sm mr-1" /> <span className="line-lg" />
              </h2>
              <div className="text-[var(--color-black)] mt-4">
                We're confident you'll land new customers with your first credit
                pack — and if you don't, we'll give all your credits back. No
                hassle, no questions asked.
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeCTA />
    </MainLayout>
  );
};

export default PricingPage;
