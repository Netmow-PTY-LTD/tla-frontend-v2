'use client';
import { useState } from 'react';

import { clientsfaqsData } from '@/data/data';
import SectionHeading from '@/components/main/home/SectionHeading';


export default function Faqs({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (

    <div className="tla-faq-accordion">
      {data.length > 0 &&
        data?.map((faq, index) => (
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
              className={`tla-faq-accordion-body ${index === activeIndex ? 'active' : ''
                }`}
            >
              {faq?.answer}
            </div>
          </div>
        ))}
    </div>


  );
}
