import Facebook from '@/components/icon/Facebook';
import GradientLine from '@/components/icon/GradientLine';
import LinkedIn from '@/components/icon/LinkedIn';
import Share from '@/components/icon/Share';
import Twitter from '@/components/icon/Twiiter';
import Link from 'next/link';
import React from 'react';

export default function AboutProfile() {
  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-8/12">
            <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
              <span>About</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="62"
                height="4"
                viewBox="0 0 62 4"
                fill="none"
              >
                <rect
                  x="0.138672"
                  y="0.201172"
                  width="11.3115"
                  height="3.40625"
                  rx="1.70312"
                  fill="#D9D9D9"
                />
                <rect
                  x="17.4512"
                  y="0.201172"
                  width="44.5493"
                  height="3.40625"
                  rx="1.70312"
                  fill="#00C3C0"
                />
              </svg>
            </h2>
            <div className="text-[16px] text-black pr-0 lg:pr-20">
              Collette is a partner and the National Practice Group Leader of
              Lander & Rogers' Family & Relationship Law group, and one of
              Australia's most respected family lawyers. An accredited family
              law specialist, Collette has worked solely in the family law
              jurisdiction for almost 20 years and is consistently recognised by
              the profession as one of Australia's preeminent family & divorce
              lawyers. <br /> <br />
              As a client of Collette, you will experience a service that is
              both highly professional and personal. Known for her technical
              expertise and pragmatic approach, Collette ensures her clients’
              priorities are understood as she guides them through what can be a
              challenging and emotional time. Collette’s years of experience in
              family law enable her to tailor her advice and offer strategic
              solutions aligned with the needs of the families she looks after.{' '}
              <br /> <br />
              Prior to joining Lander & Rogers Collette served as the associate
              to a judge of the Federal Circuit Court of Australia (as it then
              was) and later worked at a prominent Sydney-based family law firm.
              In her earlier career, Collette held a senior management position
              in Audit & Risk Management with a publicly listed company which,
              coupled with her specialist family law experience, gives her a
              unique understanding and perspective in matters featuring
              commercial elements. Her background and experience have led to an
              extensive and loyal referral base of financial service providers,
              accountants and therapeutic professionals, with whom she regularly
              collaborates for the mutual benefit of her clients. Collette is
              regularly nominated for industry awards and is recognised in
              national publications as one of a select number of leading
              Australian family law practitioners. She was named a finalist in
              the 2018 and 2019 Lawyer’s Weekly Partner of the Year Awards and
              was ranked as a leading family lawyer in all the individual lawyer
              categories of the 2022-2025 editions of the national
              peer-reviewed Doyle's Guide, including in both the national and
              New South Wales listings. Prior to joining Lander & Rogers
              Collette served as the associate to a judge of the Federal Circuit
              Court of Australia (as it then was) and later worked at a
              prominent Sydney-based family law firm. In her earlier career,
              Collette held a senior management position in Audit & Risk
              Management with a publicly listed company which, coupled with her
              specialist family law experience, gives her a unique understanding
              and perspective in matters featuring commercial elements. Her
              background and experience have led to an extensive and loyal
              referral base of financial service providers, accountants and
              therapeutic professionals, with whom she regularly collaborates
              for the mutual benefit of her clients. Collette is regularly
              nominated for industry awards and is recognised in national
              publications as one of a select number of leading Australian
              family law practitioners. She was named a finalist in the 2018 and
              2019 Lawyer’s Weekly Partner of the Year Awards and was ranked as
              a leading family lawyer in all the individual lawyer categories of
              the 2022-2025 editions of the national peer-reviewed Doyle's
              Guide, including in both the national and New South Wales
              listings. <br /> <br />
              In her role as National Practice Group Leader, Collette guides a
              team of over 100 family lawyers and legal support professionals
              based in the firm's Brisbane, Melbourne and Sydney offices.
              Collette is renowned for her solutions-focused approach to
              resolving family law disputes and she inspires the same behaviours
              in the team she leads.
            </div>
          </div>
          <div className="w-full lg:w-1/3 pl-8 flex gap-10">
            <GradientLine className="hidden lg:block" />
            <div className="div">
              <h2 className="text-[24px] font-semibold mb-4">
                Related areas of expertise{' '}
              </h2>
              <div className="flex flex-col">
                <div className="border-1 border border-gray-300 py-2 px-4 mr-2 mb-2 rounded-lg text-center">
                  Family and relation law
                </div>
                <div className="border-1 border border-gray-300 py-2 px-4 mr-2 mb-2 rounded-lg text-center">
                  Family and relation law
                </div>
                <div className="border-1 border border-gray-300 py-2 px-4 mr-2 mb-2 rounded-lg text-center">
                  Family and relation law
                </div>
              </div>
              <h2 className="text-[18px] font-semibold mb-4 mt-8">Share</h2>
              <div className="flex flex-wrap gap-5">
                <Link href="#" className="mr-2 mb-2">
                  <Facebook className="w-6 h-6 text-gray-600" />
                </Link>
                <Link href="#" className="mr-2 mb-2">
                  <LinkedIn className="w-6 h-6 text-gray-600" />
                </Link>
                <Link href="#" className="mr-2 mb-2">
                  <Twitter className="w-6 h-6 text-gray-600" />
                </Link>
                <Link href="#" className="mr-2 mb-2">
                  <Share className="w-6 h-6 text-gray-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
