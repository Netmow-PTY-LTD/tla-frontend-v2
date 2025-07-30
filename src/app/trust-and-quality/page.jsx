import PageBanner from '@/components/common/PageBanner';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import React from 'react';

export default function TrustAndQuality() {
  return (
    <MainLayout>
      <PageBanner
        title="Trust & Quality"
        subtitle="Committed to Excellence"
        bgImage={'/assets/img/trust-bg.webp'}
        paragraph="We ensure verified lawyers, secure communication, and high service standards. Our platform is built on trust, transparency, and a commitment to delivering reliable legal support to every client."
      />
      <section className="pt-[50px]">
        <div className="container">
          <div className="page-content">
            <p>At The Law App service and trust are our key principles.</p>
            <p>
              When you pay your lawyer through our secure financial gateway you
              are guaranteed that the agreed funds are transferred where they
              are meant to go.
            </p>
            <p>
              We back this up with a guarantee that the agreed work will get
              done or you will receive a full or partial refund if our lawyer
              users cannot show and demonstrate that they have done what was
              agreed in the first place.
            </p>
            <p>
              Australian solicitor and barrister conduct rules set out the
              obligations lawyers have to you and if your task is over a certain
              amount you must sign a legal services contract with your lawyer.
            </p>
            <p>
              The conduct of lawyers in Australia and their service to clients
              is protected by the state and territory Law Societies and lawyers
              can face penalties with the Legal Services Commission. If you are
              not happy with the service a lawyer provides to you it is your
              right to ensure they treat your case according to strict ethical
              obligations under the conduct rules.
            </p>
            <p>
              We also make sure that the lawyers who use the marketplace are who
              they say they are and hold the required qualifications to work as
              lawyers in Australia. We verify this with three layers of checks:
            </p>
            <ol>
              <li>
                Provision of copies of visual, original identity documents such
                as current drivers licence showing current residential address;
              </li>
              <li>
                Provision of current practicing certificate, independently
                checked by us with the relevant state or territory Law Society;
                and
              </li>
              <li>
                An in person or telephone interview with the lawyer to verify
                their credentials.
              </li>
            </ol>
            <p>
              Don’t forget that before you make any payment to you lawyer they
              must provide you with a free, no obligation appointment via voice
              or video chat through The Law App so you are happy with the lawyer
              you have chosen before you pay a cent.
            </p>
            <p>
              With The Law App you have quadruple protection for your investment
              in the lawyer you choose to help you solve your legal situation.
            </p>
          </div>
        </div>
      </section>
      <HomeCTA />
    </MainLayout>
  );
}
