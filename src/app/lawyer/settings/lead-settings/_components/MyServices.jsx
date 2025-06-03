import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion } from '@/components/ui/accordion';
import ServiceCard from './my-services/ServiceCard';
import LocationItem from './my-services/LoactionItem';

import AddLeadServiceModal from './my-services/AddLeadServiceModal';

const ServicesList = () => {
  const serviceList = [
    {
      id: 'contracts-lawyer',
      title: 'Contracts Lawyer',
      subtitle:
        'Helping clients draft and review legal agreements efficiently.',
      description:
        'Our contract lawyers specialize in ensuring every clause protects your interests—be it employment, leases, or vendor agreements.',
      question: 'What best describes your contract needs?',
      options: ['Employment', 'Lease', 'Sales', 'Partnership'],
      defaultSelectedOptions: ['Employment', 'Lease', 'Sales', 'Partnership'],
    },
    {
      id: 'notary-public',
      title: 'Lawyers, Solicitors & Notary Publics',
      subtitle: 'Supporting customers with legal certifications and advice.',
      description:
        'Certified professionals for notarization, legal consulting, and public documentation—available across multiple locations.',
      question: 'What service are you looking for?',
      options: ['Document notarization', 'Legal advice', 'Representation'],
      defaultSelectedOptions: [
        'Document notarization',
        'Legal advice',
        'Representation',
      ],
    },
    {
      id: 'biz-consultants',
      title: 'Business Consultants',
      subtitle: 'Get guidance tailored to your business scale.',
      description:
        'From startups to enterprises, our consultants offer data-driven solutions and proven business strategies to help you grow.',
      question: 'Which type of business are you running?',
      options: ['Startup', 'SME', 'Enterprise', 'Freelance'],
      defaultSelectedOptions: ['Startup', 'SME', 'Enterprise', 'Freelance'],
    },
    {
      id: 'estate-lawyer',
      title: 'Estate Lawyer',
      subtitle: 'Assisting with wills, trusts, and estate planning.',
      description:
        "Our estate planning experts simplify the legalities around wills, trusts, and asset transfers to secure your family's future.",
      question: 'What estate services do you need?',
      options: ['Will drafting', 'Trust setup', 'Inheritance guidance'],
      defaultSelectedOptions: [
        'Will drafting',
        'Trust setup',
        'Inheritance guidance',
      ],
    },
  ];
  // const serviceList = [];
  return (
    <div className=" mx-auto">
      <div className="space-y-6">
        {/* Services Section */}
        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Services
            </h2>
            {/* <Button className="bg-teal-500 hover:bg-teal-600">
              + Add a service
            </Button> */}
            <AddLeadServiceModal />
          </div>
          <p className="text-gray-500 mb-6">
            Tell us what services you provide so we can send you the most
            relevant leads
          </p>

          <Accordion
            type="single"
            collapsible
            className="border-t border-gray-200"
          >
            {serviceList.length > 0 ? (
              serviceList.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  subtitle={service.subtitle}
                  description={service.description}
                  question={service.question}
                  options={service.options}
                  defaultSelectedOptions={service.defaultSelectedOptions}
                />
              ))
            ) : (
              <div className="text-center p-4 ">
                <h2 className="text-lg font-semibold">No services available</h2>
                <p className="text-sm ">
                  Click above to add your first service.
                </p>
              </div>
            )}
          </Accordion>
        </section>

        {/* Locations Section */}
        <section className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Locations
            </h2>
            <Button className="bg-teal-500 hover:bg-teal-600">
              + Add a location
            </Button>
          </div>
          <p className="text-gray-500 mb-6">
            Choose where you want to find new customers.
          </p>

          <div className="space-y-1">
            <LocationItem distance={150} location="Alberton" />
            <LocationItem distance={30} location="Logan City" />
          </div>
        </section>

        {/* Remote Services Section */}
        <section className="p-6 border-t  border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your Locations
          </h2>
          <p className="text-gray-500 mb-6">
            Customers tell us if they're happy to receive services online or
            remotely.
          </p>

          <div className="flex items-center justify-between bg-white p-4">
            <span className="text-gray-700">See online/remote leads</span>
            <Switch />
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="bg-teal-500 hover:bg-teal-600 px-8">
              View Leads
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesList;
