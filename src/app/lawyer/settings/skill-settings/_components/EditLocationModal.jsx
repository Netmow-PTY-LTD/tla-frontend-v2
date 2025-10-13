'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/UIComponents/Modal';
import { useAllServicesQuery } from '@/store/features/admin/servicesApiService';
import { useAddLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
import { Clock, Globe, Loader, MapPin, SquarePen, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DistanceMap from '../../profile/_components/DistanceMap';
import TravelTimeSelector from './TravelTimeSelector';
import {
  useCreateLocationMutation,
  useGetSingleLocationQuery,
  useUpdateLocationMutation,
} from '@/store/features/lawyer/locationApiService';
import { useSelector } from 'react-redux';
import countries from '@/data/countries.json';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';

const EditLocationModal = ({
  open,
  setOpen,
  services,
  locationId,
  locationType,
  refetchLeadServicesAndLocations,
}) => {
  const [step, setStep] = useState('initial'); // 'initial' | 'distance' | 'travelTime' | 'draw'
  const [distanceLocation, setDistanceLocation] = useState('');
  const [radius, setRadius] = useState(0);
  const [travelTimeLocation, setTravelTimeLocation] = useState('');
  const [traveltime, setTraveltime] = useState('');
  const [travelmode, setTravelmode] = useState('');
  const [selectedServices, setSelectedServices] = useState(
    services?.map((s) => s?.service?._id) || []
  );
  const [travelTimeSelectedServices, setTravelTimeSelectedServices] = useState(
    []
  );
  const [nationwideSelectedServices, setNationwideSelectedServices] = useState(
    []
  );

  //console.log('locations in modal:', locations);
  const resetModal = () => {
    setStep('initial');
    setOpen(false);
  };

  console.log('locationId in edit modal:', locationId);

  const { data: singleLocationData, isLoading: isLoadingSingleLocation } =
    useGetSingleLocationQuery(locationId, {
      skip: !locationId,
    });

  console.log('singleLocationData', singleLocationData);

  const cookieCountry = safeJsonParse(Cookies.get('countryObj'));

  const defaultLocation = countries?.find(
    (c) => c.countryId === cookieCountry?.countryId
  )?.default_location;

  useEffect(() => {
    const loc = singleLocationData?.data;

    if (loc) {
      // Editing existing location
      if (loc?.locationType === 'distance_wise') {
        if (loc?.locationGroupId) {
          setDistanceLocation(loc.locationGroupId);
        }
        setRadius(loc.rangeInKm || 0);
        setSelectedServices(
          (loc.serviceIds || []).map((s) => s._id.toString())
        );
      }

      if (loc?.locationType === 'travel_time') {
        if (loc?.locationGroupId) {
          setTravelTimeLocation(loc.locationGroupId);
        }
        setTraveltime(loc.traveltime);
        setTravelmode(loc.travelmode);
        setTravelTimeSelectedServices(
          (loc.serviceIds || []).map((s) => s._id.toString())
        );
      }

      if (loc?.locationType === 'nation_wide') {
        setNationwideSelectedServices(
          (loc.serviceIds || []).map((s) => s._id.toString())
        );
      }
    } else {
      // Creating new location
      if (!distanceLocation) {
        setDistanceLocation(defaultLocation);
      }
      if (!travelTimeLocation) {
        setTravelTimeLocation(defaultLocation);
      }
    }
  }, [locationId, singleLocationData?.data]);

  console.log('travelTimeLocation', travelTimeLocation);
  console.log('travelTime', traveltime);
  console.log('travelMode', travelmode);
  console.log('travelTimeSelectedServices', travelTimeSelectedServices);

  const handleServiceChange = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  console.log('radius in modal:', radius);
  console.log('distanceLocation in edit modal:', distanceLocation);

  const [updateLocation, { isLoading: isUpdatingLocation }] =
    useUpdateLocationMutation();
  const distanceLocationSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      locationGroupId: distanceLocation?._id,
      rangeInKm: radius,
      serviceIds: selectedServices,
      locationType: 'distance_wise',
    };

    console.log('Submitting distance location payload...', payload);

    try {
      const res = await updateLocation({
        id: locationId,
        body: payload,
      }).unwrap();
      console.log('Location response:', res);
      if (res) {
        showSuccessToast(
          res?.message || 'Distance location updated successfully!'
        );
        // refetchLeadServicesAndLocations();
        resetModal();
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.message || 'Failed to update distance location.');
    }
  };

  const handleTravelTimeServiceChange = (id) => {
    setTravelTimeSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const travelTimeLocationSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      locationGroupId: travelTimeLocation?._id,
      traveltime,
      travelmode,
      serviceIds: travelTimeSelectedServices,
      locationType: 'travel_time',
    };

    console.log('Travel time payload:', payload);
    // Handle travel time location submission logic here
    // showSuccessToast('Travel time location added successfully!');
    // resetModal();
    try {
      const res = await updateLocation({
        id: locationId,
        body: payload,
      }).unwrap();
      console.log('Location based on travel time response:', res);
      if (res) {
        showSuccessToast(
          res?.message || 'Location based on travel time added successfully!'
        );
        // refetchLeadServicesAndLocations();
        resetModal();
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.message || 'Failed to add location based on travel time.'
      );
    }
  };

  const handleNationWideServiceChange = (id) => {
    setNationwideSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const nationwideLocationSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting nationwide location...');

    const payload = {
      serviceIds: nationwideSelectedServices,
      locationType: 'nation_wide',
    };
    console.log('Nationwide payload:', payload);
    // Handle nationwide location submission logic here
    // showSuccessToast('Nationwide location added successfully!');
    // resetModal();

    try {
      const res = await updateLocation({
        id: locationId,
        body: payload,
      }).unwrap();
      console.log('Location based on nationwide selection response:', res);
      if (res) {
        showSuccessToast(
          res?.message ||
            'Location based on nationwide selection added successfully!'
        );
        // refetchLeadServicesAndLocations();
        resetModal();
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.message || 'Failed to add location based on travel time.'
      );
    }
  };

  //   console.log('distanceLocation', distanceLocation);
  //   console.log('Distance', distance);
  console.log('Selected Services', selectedServices);

  return (
    <div>
      <Modal
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) resetModal();
        }}
        className="w-full" // ensure modal is full width (adjust max-width as needed)
        width="max-w-[700px]"
      >
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
          {/* Distance Wise Location */}
          {locationType === 'distance_wise' && (
            <form onSubmit={distanceLocationSubmit}>
              {step === 'initial' && (
                <div>
                  <h3 className="text-2xl font-semibold text-center mb-2">
                    Distance
                  </h3>
                  <div className="text-sm text-gray-500 text-center mb-8">
                    Enter a location and set radius.
                  </div>
                  <div className="">
                    <DistanceMap
                      distanceLocation={distanceLocation}
                      setDistanceLocation={setDistanceLocation}
                      radius={radius}
                      setRadius={setRadius}
                    />
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={resetModal}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep('distanceNext')}
                      className="px-4 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--primary-color)] transition-all duration-300 ease-in-out"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 'distanceNext' && (
                <div>
                  <h3 className="text-2xl font-semibold text-center mb-8">
                    Distance Wise Services
                  </h3>

                  <div className="space-y-4">
                    {services?.length > 0 ? (
                      services?.map((service, index) => (
                        <div
                          className="border border-gray-200 h-[48px] px-4 rounded flex flex-col justify-center gap-4"
                          key={index}
                        >
                          <label
                            htmlFor={`service-${index}`}
                            className="text-gray-500 flex items-center justify-between gap-4 cursor-pointer h-full"
                          >
                            {service?.service?.name}
                            <input
                              type="checkbox"
                              id={`service-${index}`}
                              value={service?.service?._id}
                              onChange={() =>
                                handleServiceChange(service?.service?._id)
                              }
                              className="cursor-pointer"
                              checked={selectedServices.includes(
                                service?.service?._id
                              )}
                            />
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <h2 className="text-lg font-semibold">
                          No services available
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Click above to add your first service.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep('initial')}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--primary-color)] transition-all duration-300 ease-in-out"
                    >
                      {isUpdatingLocation ? (
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin h-4 w-4" />
                          Updating...
                        </div>
                      ) : (
                        'Update'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Travel Time Location */}
          {locationType === 'travel_time' && (
            <form onSubmit={travelTimeLocationSubmit}>
              {step === 'initial' && (
                <div>
                  <h3 className="text-2xl font-semibold text-center mb-2">
                    Travel Time
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-8">
                    Enter your max travel time.
                  </p>
                  <div className="">
                    <TravelTimeSelector
                      travelTimeLocation={travelTimeLocation}
                      setTravelTimeLocation={setTravelTimeLocation}
                      radius={traveltime}
                      setRadius={setTraveltime}
                      mode={travelmode}
                      setMode={setTravelmode}
                    />
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={resetModal}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep('travelTimeNext')}
                      className="px-4 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--primary-color)] transition-all duration-300 ease-in-out"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 'travelTimeNext' && (
                <div>
                  <h3 className="text-2xl font-semibold text-center mb-2">
                    Travel Time Wise Services
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-8">
                    Select what services you provide in this location
                  </p>
                  <div className="space-y-4">
                    {services?.length > 0 ? (
                      services?.map((service, index) => (
                        <div
                          className="border border-gray-200 h-[48px] px-4 rounded flex flex-col justify-center gap-4"
                          key={index}
                        >
                          <label
                            htmlFor={`service-${index}`}
                            className="text-gray-500 flex items-center justify-between gap-4 cursor-pointer h-full"
                          >
                            {service?.service?.name}
                            <input
                              type="checkbox"
                              id={`service-${index}`}
                              value={service?.service?._id}
                              onChange={() =>
                                handleTravelTimeServiceChange(
                                  service?.service?._id
                                )
                              }
                              className="cursor-pointer"
                              checked={travelTimeSelectedServices.includes(
                                service?.service?._id
                              )}
                            />
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <h2 className="text-lg font-semibold">
                          No services available
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Click above to add your first service.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep('initial')}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--primary-color)] transition-all duration-300 ease-in-out"
                    >
                      {isUpdatingLocation ? (
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin h-4 w-4" />
                          Saving...
                        </div>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Nationwide Location */}

          {locationType === 'nation_wide' && (
            <form onSubmit={nationwideLocationSubmit}>
              <div>
                <h3 className="text-2xl font-semibold text-center mb-8">
                  Nationwide Services
                </h3>

                {services?.length > 0 ? (
                  services?.map((service, index) => (
                    <div
                      className="border border-gray-200 h-[48px] px-4 rounded flex items-center justify-between gap-4"
                      key={index}
                    >
                      <label className="text-gray-500">
                        {service?.service?.name}
                      </label>
                      <input
                        type="checkbox"
                        value={service?.service?._id}
                        onChange={() =>
                          handleNationWideServiceChange(service?.service?._id)
                        }
                        className="cursor-pointer"
                        checked={nationwideSelectedServices.includes(
                          service?.service?._id
                        )}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">
                    <h2 className="text-lg font-semibold">
                      No services available
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Click above to add your first service.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={resetModal}
                    className="px-4 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--primary-color)] transition-all duration-300 ease-in-out"
                  >
                    {isUpdatingLocation ? (
                      <div className="flex items-center gap-2">
                        <Loader className="animate-spin h-4 w-4" />
                        Saving...
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* {step === 'draw' && (
            <div>
              <h3 className="text-2xl font-semibold text-center mb-2">
                Step: Draw on Map
              </h3>
              <p className="text-sm text-gray-500 text-center mb-8">
                Use the tool to draw your area.
              </p>
              <div className="bg-[#f1f1f1] p-6 rounded text-center">
                [Drawing Tool]
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('initial')}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('drawNext')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 'drawNext' && (
            <div>
              <h3 className="text-2xl font-semibold text-center mb-2">
                Step: Draw - Confirm
              </h3>
              <p className="text-sm text-gray-500 text-center mb-8">
                Confirm the area you drew.
              </p>
              <div className="bg-[#f1f1f1] p-6 rounded text-center">
                [Draw Area Review]
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('draw')}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={resetModal}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Finish
                </button>
              </div>
            </div>
          )} */}
        </div>
      </Modal>
    </div>
  );
};

export default EditLocationModal;
