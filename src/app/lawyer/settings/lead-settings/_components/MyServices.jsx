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
import Link from 'next/link';

const ServicesList = () => {
  const {
    data: leadServicesData,
    isLoading,
    isError,
    error,
  } = useGetLeadServiceListQuery();
  const leadServices = leadServicesData?.data.service || [];
  const locations = leadServicesData?.data.locations || [];

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

          <Accordion type="single" collapsible="true">
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
                {leadServices?.map((service) => (
                  <ServiceCard
                    key={service?.service?._id}
                    leadServiceId={service?.service?._id}
                    title={service?.service?.name}
                    questions={service?.questions}
                    // serviceLocations={locations}
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
            {/* <Button className="bg-[#12C7C4CC] hover:bg-teal-300 px-4 py-3 text-sm rounded-lg text-white mt-5">
              + Add a location
            </Button> */}
          </div>
          <p className="text-gray-500 mb-6">
            Choose where you want to find new customers.
          </p>

          <div className="space-y-1">
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
                  {error?.data?.message || 'Failed to load locations.'}
                </span>
              </div>
            ) : locations?.length > 0 ? (
              <div className="space-y-1">
                {locations.map((loc) => (
                  <LocationItem key={loc._id} location={loc} />
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <h2 className="text-lg font-semibold">No locations selected</h2>
                <p className="text-sm text-muted-foreground">
                  Select a location to get started.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Remote Services Section */}
        {/* <section className="p-6">
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
            <Link
              href={'/lawyer/dashboard/leads-board'}
              className="bg-[#12C7C4CC] hover:bg-teal-300  py-3 text-sm rounded-lg text-white mt-5 px-4"
            >
              View Leads
            </Link>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default ServicesList;
