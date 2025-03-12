"use client";
import { useState } from "react";
import SectionHeading from "../home/SectionHeading";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqData = [
    {
      id: 1,
      question: "What is the TLA?",
      answer:
        "The Three Letter Acronym (TLA) stands for 'Technology, Leadership, and Advancement'. It is a three-letter acronym that describes the primary purpose, mission, and objectives of a company, organization, or project.",
    },

    {
      id: 2,
      question: "Is The Law App free to use?",
      answer:
        "Yes, The Law App is completely free to use. We encourage you to explore the platform and learn about the law in your own time.",
    },

    {
      id: 3,
      question: "How does The Law App ensure the quality of lawyers?",
      answer:
        "The Law App uses a combination of verified and certified lawyers, as well as independent law firms. We also ensure that our lawyers are licensed and comply with all relevant laws and regulations. Additionally, we monitor the quality of our lawyers through reviews and feedback from our users.",
    },
    {
      id: 4,
      question: "How do I find a lawyer?",
      answer:
        "To find a lawyer, you can use our search bar, browse our directory of lawyers, or contact our support team. We're here to help you find the right lawyer for your situation.",
    },

    {
      id: 5,
      question: "Can I communicate with lawyers before hiring?",
      answer:
        "Yes, you can communicate with lawyers before hiring. We encourage you to research the lawyer's background, qualifications, and experience. Additionally, we provide resources and support to help you find the best possible match for your situation.",
    },
    {
      id: 6,
      question: "How much does hiring a lawyer cost?",
      answer:
        "Hiring a lawyer can vary depending on the type of law you're dealing with, the complexity of your case, and the fees you're willing to pay. However, we recommend reaching out to a lawyer with experience in your specific area to discuss your needs and find the best possible solution.",
    },
    {
      id: 7,
      question: "What if I’m not satisfied with the lawyer I chose?",
      answer:
        "We understand that finding the right lawyer can be challenging. However, we encourage you to continue exploring the platform and learning about the law. If you're not satisfied with the lawyer you chose, you can reach out to our support team and we'll do our best to help you find a better match.",
    },
  ];
  return (
    <section className="tla-faq">
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
                  <h2>
                    <span>{index + 1}.</span> {faq?.question}
                  </h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className={`${index === activeIndex ? "rotate" : ""}`}
                  >
                    <path
                      fill="#575757"
                      d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
                    />
                  </svg>
                </div>
                <div
                  className={`tla-faq-accordion-body ${
                    index === activeIndex ? "active" : ""
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
