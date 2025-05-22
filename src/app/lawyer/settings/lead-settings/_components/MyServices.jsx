import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion } from '@/components/ui/accordion';
import ServiceCard from './my-services/ServiceCard';
import LocationItem from './my-services/LoactionItem';

const ServicesList = () => {
  return (
    <div className=" mx-auto">
      <div className="space-y-6">
        {/* Services Section */}
        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Services
            </h2>
            <Button className="bg-teal-500 hover:bg-teal-600">
              + Add a service
            </Button>
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
            <ServiceCard title="Contracts Lawyer" />
            <ServiceCard title="Lawyers, Solicitors & Notary Publics" />
            <ServiceCard title="Legal Document Preparation" />
            <ServiceCard title="Estate Lawyer" />
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
