import PageBanner from '@/components/common/PageBanner';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import Image from 'next/image';
import Link from 'next/link';

const PricingPageComponent = () => {
  return (
    <MainLayout>
      <PageBanner
        title="Pricing"
        bgImage="/assets/img/pricing-bg.webp"
        paragraph={
          'From the moment you sign up, we’ll start sending you leads — completely free. You only pay when you choose to contact the customers that are right for your business.'
        }
      />
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
              <h2 className="section-title">
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
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-7/12">
              <h2 className="section-title">
                Elite Pro
                <span className="line-sm mr-1 ml-5" />{' '}
                <span className="line-lg" />
              </h2>
              <div className="text-[var(--color-black)] mt-4">
                Boost your visibility and credibility with the Elite Pro plan.
                Enjoy exclusive discounts, SEO benefits, faster support, and a
                Gold Badge that helps attract more clients.
              </div>
            </div>
            <div className="w-full md:w-5/12 mt-10 md:mt-0">
              <div className="image-container flex justify-center md:justify-end">
                <Image
                  src="/assets/img/elite-pro.webp"
                  width={320}
                  height={287}
                  alt="elite pro"
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
                  src="/assets/img/subscription.webp"
                  width={265}
                  height={295}
                  alt="subscription"
                  className=""
                />
              </div>
            </div>
            <div className="w-full md:w-7/12 mt-10 md:mt-0">
              <h2 className="section-title">
                Why You Need a Subscription <br />
                <span className="line-sm mr-1" /> <span className="line-lg" />
              </h2>
              <div className="text-[var(--color-black)] mt-4">
                Gain more client enquiries, boost visibility, and grow your
                business with exclusive plan benefits.
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeCTA />
    </MainLayout>
  );
};

export default PricingPageComponent;
