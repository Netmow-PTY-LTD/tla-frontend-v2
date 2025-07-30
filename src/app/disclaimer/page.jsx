import PageBanner from '@/components/common/PageBanner';
import MainLayout from '@/components/main/common/layout';
import HomeCTA from '@/components/main/home/HomeCTA';
import Link from 'next/link';
import React from 'react';

export default function Disclaimer() {
  return (
    <MainLayout>
      <PageBanner
        title="Disclaimer"
        subtitle={'Important Legal Notice'}
        bgImage="/assets/img/disclaimer-bg.webp"
        paragraph={`This platform provides general legal information only. We do not offer legal advice or establish attorney-client relationships. Please consult a licensed lawyer for legal guidance specific to your situation.`}
      />
      <section className="pt-[50px]">
        <div className="container">
          <div className="page-content">
            <p>
              Certain sections of this website may contain lawyer advertising,
              promotional and / or marketing materials. The Law App does not
              endorse the accuracy or dependability of such information provided
              by individual lawyers.
            </p>
            <p>
              Posting of legal problems and other information to the website are
              not privileged, and should not contain confidential or sensitive
              information. The website provides access to this information to
              independent lawyers and provides information from those
              independent lawyers to other users of the website. All information
              provided to The Law App is done so at the user’s (potential client
              and lawyer) volition and risk.
            </p>
            <p>
              The Law App, is not a law firm or a substitute for a lawyer or law
              firm. The Law App does not and cannot provide advice, opinions, or
              recommendations about legal matters. The opinions of the lawyers
              and prospective clients posted on this website are those of the
              individual or organisation posting such information. These
              opinions / information are not those of The Law App and do not
              represent legal advice.
            </p>
            <p>
              <strong>No Legal Advice Intended</strong>
            </p>
            <p>
              This website includes general information about legal issues and
              updates about the legal system or similar in Australia or the
              world. This information is not intended to be legal advice nor
              should it be construed as such regarding any topic discussed.
            </p>
            <p>
              Such provision of material is for information purposes only and
              may not be indicative or accurate with respect to the latest
              developments in legal or similar matters.
            </p>
            <p>
              We advise that no user of the website should act on or refrain
              from acting on the basis of any content provided on the website
              without seeking the appropriate legal or other professional advice
              from an appropriate lawyer. The Law App expressly disclaims all
              liability with respect to actions taken or not taken based on any
              or all of the content displayed at any time on this website.
            </p>
            <p>
              <strong>
                No Lawyer-Client Relationship Created by Use of this Website{' '}
              </strong>
            </p>
            <p>
              This website is not intended to create a lawyer client
              relationship or fiduciary relationship of any kind. Neither user’s
              receipt of information from this website, nor user’s use of this
              website to contact the lawyers that use or are identified on the
              website creates a lawyer-client or lawyer-prospective client
              relationship. A lawyer-client or lawyer-prospective client
              relationship can only be established privately between the lawyer
              and the client, as negotiated and agreed to between the client and
              the lawyer and is subject to the professional conduct rules of
              lawyers practicing in their State or within Australia.
            </p>
            <p>
              <strong>No Confidentiality</strong>
            </p>
            <p>
              Potential client’s seeking assistance on this website may have the
              ability to post information that will be made available to
              appropriate lawyers and may be displayed in areas of the website
              that are open to public viewing and similar for Lawyers posting
              work proposals to clients. We recommend that users not use this
              website to provide confidential information about a legal issue or
              job.
            </p>
            <p>
              Use of this website, filling in a form on this website, or sending
              an unsolicited email to the website or any lawyers that use or are
              identified on the website does not make you a client or a
              prospective client of that lawyer. Users posting legal requests or
              questions on the website may be visible to the public or other
              users and as such the posted material on the website is not
              privileged or confidential, and may be reviewed by any lawyer who
              has an account with the website. Accordingly, you should not
              include names, contact information, personal passwords or access
              numbers, information that may implicate you in a crime or expose
              you to civil or criminal liability, or any other sensitive
              information in your job posting. The Law App and the lawyers that
              use or are identified on the website have no duty to maintain the
              confidentiality of any unsolicited information sent by you and
              posted on the website until a private lawyer-client relationship
              is formed between you.
            </p>
            <p>
              <strong>
                No Claim of Expertise, Specialisation or Certification<u>.</u>{' '}
              </strong>
            </p>
            <p>
              The Law App and the lawyers that use or are identified on the
              website may list areas in which they practice. In doing so, no
              lawyer makes a claim of “expertise,” “specialisation,” or
              “certification” unless otherwise expressly stated and / or
              identified by that lawyer.
            </p>
            <p>
              <strong>
                Limited Independent Verification of Lawyer Certification and
                Insurance.{' '}
              </strong>
            </p>
            <p>
              The Law App does take reasonable steps independently verify that
              the lawyers using the website are authorised to practice law in
              the state or territory of Australia claimed by the lawyer. The Law
              App independently verifies that all lawyers who create an account
              hold a current practising certificate in the State or Territory in
              which they practice. Verification that the lawyer is authorised to
              practise in the jurisdiction in which you request they do, is not
              undertaken by The Law App.
            </p>
            <p>
              The Law App does not verify that the Lawyers who use this website
              hold the appropriate insurances to practice law, that they are
              competent legal service providers, or that the information posted
              to the website or provided to clients by lawyers is accurate. It
              is the prospective client’s responsibility to make verification of
              the lawyer’s ability to practice in their matter and jurisdiction
              and that they hold the appropriate insurances to do so.
            </p>
            <p>
              The Law App relies on the lawyers to verify that they are licensed
              and insured to practice law in the States and territories
              identified, competent legal service providers, and that the
              information posted to the website or provided to clients is
              accurate. Before hiring or retaining lawyers, clients should
              independently verify that the lawyers are licensed and insured to
              practice law in the States and Territories identified, competent
              legal service providers, and that the information posted to the
              website or provided to clients by lawyers is accurate.
            </p>
          </div>
        </div>
      </section>
      <HomeCTA />
    </MainLayout>
  );
}
