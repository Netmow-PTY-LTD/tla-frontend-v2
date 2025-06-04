import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion } from '@/components/ui/accordion';
import ServiceCard from './my-services/ServiceCard';
import LocationItem from './my-services/LoactionItem';

import AddLeadServiceModal from './my-services/AddLeadServiceModal';
import { useGetLeadServiceListQuery } from '@/store/features/leadService/leadServiceApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const ServicesList = () => {
  const {
    data: leadServicesData,
    isLoading,
    isError,
    error,
  } = useGetLeadServiceListQuery();
  const leadServices = leadServicesData?.data || [];

  // const leadServices = [
  //   {
  //     _id: '665aabcde1234567890abc01',
  //     userProfileId: '665aa0000b1234567890abcd1',
  //     serviceName: 'Family Lawyer',
  //     serviceId: {
  //       _id: '665aa0000c1234567890abcd2',
  //       name: 'Family Lawyer',
  //       slug: 'family-lawyer',
  //       questions: [
  //         {
  //           _id: '665aa1111d1234567890abcd3',
  //           question: 'What do you need help with?',
  //           slug: 'what-do-you-need-help-with',
  //           questionType: 'checkbox',
  //           order: 1,
  //           options: [
  //             {
  //               _id: '665aa1111d1234567890abcd4',
  //               name: 'Divorce',
  //               slug: 'divorce',
  //             },
  //             {
  //               _id: '665aa1111d1234567890abcd5',
  //               name: 'Child custody',
  //               slug: 'child-custody',
  //             },
  //             {
  //               _id: '665aa1111d1234567890abcd6',
  //               name: 'Adoption',
  //               slug: 'adoption',
  //             },
  //           ],
  //         },
  //       ],
  //       defaultSelectedOptions: [
  //         '665aa1111d1234567890abcd4',
  //         '665aa1111d1234567890abcd5',
  //       ],
  //     },
  //     locations: ['Chicago', 'Houston'],
  //     onlineEnabled: true,
  //   },
  //   {
  //     _id: '665aabcde1234567890abc02',
  //     userProfileId: '665aa0000b1234567890abcd2',
  //     serviceName: 'Familydgd Lawyer',
  //     serviceId: {
  //       _id: '665aa0000c1234567890abcd3',
  //       name: 'Business Lawyer',
  //       slug: 'business-lawyer',
  //       questions: [
  //         {
  //           _id: '665aa1111d1234567890abcd7',
  //           question: 'What type of business help do you need?',
  //           slug: 'business-help-type',
  //           questionType: 'checkbox',
  //           order: 1,
  //           options: [
  //             {
  //               _id: '665aa1111d1234567890abcd8',
  //               name: 'Contracts',
  //               slug: 'contracts',
  //             },
  //             {
  //               _id: '665aa1111d1234567890abcd9',
  //               name: 'LLC Formation',
  //               slug: 'llc-formation',
  //             },
  //             {
  //               _id: '665aa1111d1234567890abcda',
  //               name: 'Trademark',
  //               slug: 'trademark',
  //             },
  //           ],
  //         },
  //         {
  //           _id: '665aa1111d1234567890abce9',
  //           question: 'What type of business help do you need?',
  //           slug: 'business-help-type',
  //           questionType: 'checkbox',
  //           order: 1,
  //           options: [
  //             {
  //               _id: '665aa1111d1234567892abcd8',
  //               name: 'Contracts',
  //               slug: 'contracts',
  //             },
  //             {
  //               _id: '665aa1111d1234567390abcd9',
  //               name: 'LLC Formation',
  //               slug: 'llc-formation',
  //             },
  //             {
  //               _id: '665aa1111d1234563890abcda',
  //               name: 'Trademark',
  //               slug: 'trademark',
  //             },
  //           ],
  //         },
  //       ],
  //       defaultSelectedOptions: ['665aa1111d1234567890abcd8'],
  //     },
  //     locations: ['San Francisco', 'Seattle'],
  //     onlineEnabled: false,
  //   },
  //   {
  //     _id: '665aabcde1234567890abc03',
  //     userProfileId: '665aa0000b1234567890abcd3',
  //     serviceName: 'Family dffdLawyer',
  //     serviceId: {
  //       _id: '665aa0000c1234567890abcd4',
  //       name: 'Criminal Defense Lawyer',
  //       slug: 'criminal-defense-lawyer',
  //       questions: [
  //         {
  //           _id: '665aa1111d1234567890abcdb',
  //           question: 'What kind of case are you facing?',
  //           slug: 'case-type',
  //           questionType: 'checkbox',
  //           order: 1,
  //           options: [
  //             { _id: '665aa1111d1234567890abcdc', name: 'DUI', slug: 'dui' },
  //             {
  //               _id: '665aa1111d1234567890abcdd',
  //               name: 'Theft',
  //               slug: 'theft',
  //             },
  //             {
  //               _id: '665aa1111d1234567890abcde',
  //               name: 'Assault',
  //               slug: 'assault',
  //             },
  //           ],
  //         },
  //       ],
  //       defaultSelectedOptions: [
  //         '665aa1111d1234567890abcdd',
  //         '665aa1111d1234567890abcde',
  //       ],
  //     },
  //     locations: ['Miami', 'Atlanta'],
  //     onlineEnabled: true,
  //   },
  // ];

  return (
    <div className=" max-[900px] mx-auto">
      <div className="space-y-6">
        {/* Services Section */}
        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Services
            </h2>

            <AddLeadServiceModal />
          </div>
          <p className="text-gray-500 mb-6">
            Tell us what services you provide so we can send you the most
            relevant leads
          </p>

          <Accordion type="multiple" collapsible>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex items-center space-x-2 text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
                <AlertCircle className="w-5 h-5" />
                <span>
                  {error?.data?.message || 'Failed to load services.'}
                </span>
              </div>
            ) : leadServices.length > 0 ? (
              <div className="w-full">
                {leadServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    leadServiceId={service._id}
                    title={service.serviceName}
                    service={service?.questions}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <h2 className="text-lg font-semibold">No services available</h2>
                <p className="text-sm text-muted-foreground">
                  Click above to add your first service.
                </p>
              </div>
            )}
          </Accordion>
        </section>

        {/* Locations Section */}
        <section className="p-6 ">
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
        <section className="p-6">
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
