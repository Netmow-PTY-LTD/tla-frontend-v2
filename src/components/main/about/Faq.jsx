'use client';
import { useState } from 'react';
import SectionHeading from '../home/SectionHeading';
import { faqData } from '@/data/data';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section className="tla-faq section">
      <div className="container">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="We've got answers!"
        />
        <div className="tla-faq-accordion">
          {faqData.length > 0 &&
            faqData?.map((faq, index) => (
              <div className="tla-faq-accordion-item" key={faq?.id}>
                <div
                  className="tla-faq-accordion-header"
                  onClick={() => toggleAccordion(index)}
                >
                  <h5>
                    <span>{index + 1}.</span> {faq?.question}
                  </h5>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className={`${index === activeIndex ? 'rotate' : ''}`}
                  >
                    <path
                      fill="#575757"
                      d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
                    />
                  </svg>
                </div>
                <div
                  className={`tla-faq-accordion-body ${
                    index === activeIndex ? 'active' : ''
                  }`}
                >
                  {faq?.answer}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
