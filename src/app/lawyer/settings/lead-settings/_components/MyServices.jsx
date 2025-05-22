import React from 'react';
import { ChevronDown, ChevronUp, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ServiceCard = ({ title }) => {
  return (
    <AccordionItem value={title} className="border-b bg-white border-gray-200">
      <AccordionTrigger className="py-4 px-4 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            Every customer answers this series of questions, allowing you to
            define exactly which type of leads you see.
          </p>
          <p className="text-sm text-gray-500 mt-1">All leads · 1 location</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">
          <div className="bg-white rounded-md p-4 border border-gray-100">
            <h4 className="font-medium text-gray-800">
              Which of these best describes you?
            </h4>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const LocationItem = ({ distance, location }) => {
  return (
    <div className="flex items-start justify-between p-4 border-b bg-white border-gray-200">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <p className="text-gray-800">
            Within {distance} miles of {location}
          </p>
          <div className="flex gap-2 mt-1">
            <button className="text-teal-500 text-sm">View on map</button>
            <span className="text-gray-400">·</span>
            <button className="text-teal-500 text-sm">Remove</button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trash2 className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

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
