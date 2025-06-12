// 'use client';

// import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useDeleteLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
// import { Trash } from 'lucide-react';
// import React, { useState } from 'react';

// const LeadServiceAction = ({
//   leadServiceId,
//   onSubmit,
//   isDirty,
//   serviceLocations = [],
//   selectedLocationIds = [],
//   setSelectedLocationIds = [],
//   // isDirtyLocation,
// }) => {
//   // console.log('isDirty ==>', isDirty);
//   console.log('serviceLocations ==>', serviceLocations);
//   const [deleteService] = useDeleteLeadServiceMutation();
//   // const [locations, setLocations] = useState(['Nationwide']);
//   // const [locations, setLocations] = useState(serviceLocations);

//   // const [selectedLocationIds, setSelectedLocationIds] = useState(
//   //   serviceLocations?.map((loc) => loc._id)
//   // );

//   // const handleAddLocation = () => {
//   //   const newLocation = prompt('Enter new location');
//   //   if (newLocation && !locations?.includes(newLocation)) {
//   //     setLocations((prev) => [...prev, newLocation]);
//   //     setSelectedLocations((prev) => [...prev, newLocation]);
//   //   }
//   // };

//   //  i will work able next time ==>
//   // const handleAddLocation = () => {
//   //   const newLocationName = prompt('Enter new location');
//   //   if (!newLocationName) return;

//   //   const newId = crypto.randomUUID(); // Generate a temp ID
//   //   const newLocation = {
//   //     _id: newId,
//   //     areaName: newLocationName,
//   //     locationType: 'custom',
//   //     locationGroupId: null,
//   //   };

//   //   setLocations((prev) => [...prev, newLocation]);
//   //   setSelectedLocationIds((prev) => [...prev, newId]);
//   // };

//   // const handleToggleLocation = (location) => {
//   //   console.log('location =>', location);
//   //   setSelectedLocations((prev) =>
//   //     prev.includes(location)
//   //       ? prev.filter((loc) => loc !== location)
//   //       : [...prev, location]
//   //   );
//   // };

//   // one solution -1
//   const handleToggleLocation = (locationId) => {
//     setSelectedLocationIds((prev) => {
//       return prev.map((location) => {
//         if (location._id !== locationId) return location;

//         const alreadyChecked = location.serviceIds?.includes(leadServiceId);

//         const updatedServiceIds = alreadyChecked
//           ? location?.serviceIds.filter((id) => id !== leadServiceId)
//           : [...location.serviceIds, leadServiceId];

//         return {
//           ...location,
//           serviceIds: updatedServiceIds,
//         };
//       });
//     });
//   };

//   const handleDeleteService = async () => {
//     const confirmDelete = window.confirm(
//       'Are you sure you want to remove this service?'
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await deleteService(leadServiceId).unwrap();

//       if (response.success) {
//         showSuccessToast(response?.message || 'Service removed successfully');
//       } else {
//         showErrorToast('Failed to remove service');
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       const errorMessage =
//         error?.data?.message || 'An error occurred while removing the service';
//       showErrorToast(errorMessage);
//     }
//   };

//   const formatLocationType = (str) => {
//     if (!str) return '';
//     return str
//       .replace(/[_-]/g, ' ') // Replace underscores and hyphens with space
//       .split(' ') // Split into words
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
//       .join(''); // Join without space for PascalCase
//   };

//   return (
//     <div className="mt-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Your Location</h2>
//         {/* <button
//           className="text-sm text-blue-600 hover:underline"
//           onClick={handleAddLocation} // implement this to show a prompt/modal/input
//         >
//           + Add Location
//         </button> */}
//       </div>

//       <div className="space-y-2">
//         {serviceLocations?.length > 0 ? (
//           serviceLocations?.map((location, index) => {
//             // console.log('selected service id ==>', leadServiceId);
//             // console.log('current location ==>' + index + '=', location);

//             const isChecked = location.serviceIds?.includes(leadServiceId);
//             // console.log('is check', isChecked);

//             return (
//               <label
//                 key={location._id}
//                 className="flex items-center justify-between px-8 py-2  rounded-md  hover:bg-gray-50"
//               >
//                 <div className="flex items-center gap-3">
//                   <Checkbox
//                     checked={isChecked}
//                     onCheckedChange={() => handleToggleLocation(location._id)}
//                     id={`location-${index}`}
//                   />
//                   <span className="text-sm text-gray-800">
//                     {formatLocationType(location?.locationType)}
//                   </span>
//                 </div>
//               </label>
//             );
//           })
//         ) : (
//           <p className="text-sm text-gray-500 italic">
//             No locations added yet.
//           </p>
//         )}
//       </div>

//       <div className="flex justify-between items-center mt-6">
//         <button
//           type="button"
//           onClick={handleDeleteService}
//           className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
//         >
//           <Trash className="w-5 h-5 mr-2" />
//           <span>Remove this Service</span>
//         </button>
//         <button
//           // disabled={!isDirty && !isDirtyLocation}
//           disabled={!isDirty}
//           // className={`px-4 py-3 text-sm rounded-lg text-white mt-5
//           //   ${
//           //     isDirty
//           //       ? 'bg-[#12C7C4CC] hover:bg-teal-300'
//           //       : isDirtyLocation
//           //       ? 'bg-[#12C7C4CC] hover:bg-teal-300'
//           //       : 'bg-gray-300 cursor-not-allowed'
//           //   }
//           // `}
//           className={`px-4 py-3 text-sm rounded-lg text-white mt-5
//             ${
//               isDirty
//                 ? 'bg-[#12C7C4CC] hover:bg-teal-300'
//                 : 'bg-gray-300 cursor-not-allowed'
//             }
//           `}
//           onClick={onSubmit}
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LeadServiceAction;

'use client';

import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { Checkbox } from '@/components/ui/checkbox';
import { useDeleteLeadServiceMutation } from '@/store/features/leadService/leadServiceApiService';
import { Trash } from 'lucide-react';
import React from 'react';

const LeadServiceAction = ({
  leadServiceId,
  onSubmit,
  isDirty,
  serviceLocations = [],
  setServiceLocations = () => {},
}) => {
  const [deleteService] = useDeleteLeadServiceMutation();

  const handleToggleLocation = (locationId) => {
    setServiceLocations((prev) =>
      prev.map((location) => {
        if (location._id !== locationId) return location;

        const alreadyChecked = location.serviceIds?.includes(leadServiceId);

        const updatedServiceIds = alreadyChecked
          ? location.serviceIds.filter((id) => id !== leadServiceId)
          : [...location.serviceIds, leadServiceId];

        return {
          ...location,
          serviceIds: updatedServiceIds,
        };
      })
    );
  };

  const handleDeleteService = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this service?'
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteService(leadServiceId).unwrap();
      if (response.success) {
        showSuccessToast(response?.message || 'Service removed successfully');
      } else {
        showErrorToast('Failed to remove service');
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage =
        error?.data?.message || 'An error occurred while removing the service';
      showErrorToast(errorMessage);
    }
  };

  const formatLocationType = (str) => {
    if (!str) return '';
    return str
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Location</h2>
        {/* Add Location button (to implement later) */}
        {/* <button
          className="text-sm text-blue-600 hover:underline"
          onClick={handleAddLocation}
        >
          + Add Location
        </button> */}
      </div>

      <div className="space-y-2">
        {serviceLocations?.length > 0 ? (
          serviceLocations.map((location, index) => {
            const isChecked = location.serviceIds?.includes(leadServiceId);

            return (
              <label
                key={location._id}
                className="flex items-center justify-between px-8 py-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() =>
                      handleToggleLocation(location._id)
                    }
                    id={`location-${index}`}
                  />
                  <span className="text-sm text-gray-800">
                    {formatLocationType(location?.locationType)}
                  </span>
                </div>
              </label>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 italic">
            No locations added yet.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleDeleteService}
          className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <Trash className="w-5 h-5 mr-2" />
          <span>Remove this Service</span>
        </button>

        <button
          disabled={!isDirty}
          className={`px-4 py-3 text-sm rounded-lg text-white mt-5 ${
            isDirty
              ? 'bg-[#12C7C4CC] hover:bg-teal-300'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LeadServiceAction;
