import { MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteLocationMutation } from '@/store/features/lawyer/locationApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { ConfirmationModal } from '@/components/UIComponents/ConfirmationModal';
import { useState } from 'react';

const LocationItem = ({ location, onEdit, refetchLocations }) => {
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [deleteLocation] = useDeleteLocationMutation();
  console.log('location in LocationItem', location);

  const formatLocationType = (type) => {
    switch (type) {
      case 'travel_time':
        return 'Travel Time';
      case 'distance_wise':
        return 'Distance';
      case 'nation_wide':
        return 'Nationwide';
      default:
        return 'Unknown';
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (locationId) {
      try {
        const res = await deleteLocation(locationId).unwrap();
        // Optionally, you can show a success message or refetch the list
        console.log('Location deleted successfully', res);
        if (res?.success) {
          showSuccessToast(res?.message || 'Location deleted successfully');
          refetchLocations();
        }
      } catch (error) {
        console.error('Failed to delete location:', error);
        showErrorToast(
          error?.data?.message || 'Failed to delete location. Please try again.'
        );
      }
    }
  };
  return (
    <div className="flex items-start justify-between p-4 border-b bg-white border-gray-200">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <p className="text-gray-800">{location?.locationGroupId?.zipcode}</p>
          <div className="text-sm text-gray-500 mt-2">
            <span className="font-normal">
              {formatLocationType(location?.locationType)}{' '}
            </span>
            {location?.rangeInKm || location?.traveltime ? (
              <>
                <span className="mx-2 w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
                <span className="font-normal">
                  <span className="font-normal">
                    {location?.rangeInKm
                      ? location?.rangeInKm
                      : location?.traveltime
                      ? location?.traveltime
                      : ''}{' '}
                    {location?.rangeInKm
                      ? 'km'
                      : location?.traveltime
                      ? 'mins'
                      : ''}{' '}
                  </span>
                </span>
              </>
            ) : null}

            {location?.travelmode ? (
              <>
                <span className="mx-2 w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
                <span className="font-normal">
                  <span className="font-normal">{location?.travelmode} </span>
                </span>
              </>
            ) : null}

            <span className="mx-2 w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
            <span className="font-normal">
              <span className="font-normal">
                {location?.serviceIds?.length || 0}{' '}
                {location?.serviceIds?.length === 1 ? 'service' : 'services'}
              </span>
            </span>
          </div>
          {/* <div className="flex gap-2 mt-1">
            <button className="text-teal-500 text-sm">View on map</button>
            <span className="text-gray-400">·</span>
            {location?.locationGroupId?.zipcode !== 'Nationwide' ? (
              <button className="text-teal-500 text-sm">Remove</button>
            ) : (
              <></>
            )}
          </div> */}
        </div>
      </div>
      <div className="flex gap-2">
        <ConfirmationModal
          open={!!deleteModalId}
          onOpenChange={(open) => {
            if (!open) setDeleteModalId(null);
          }}
          onConfirm={() => {
            handleDeleteLocation(deleteModalId);
            setDeleteModalId(null); // close after confirmation
          }}
          title="Are you sure you want to delete this location?"
          description="This action cannot be undone. Please proceed with caution."
          cancelText="No"
          confirmText="Yes, Delete"
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalId(location?._id); // ✅ open modal instead of deleting immediately
              }}
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </Button>
          }
        />

        {location?.locationGroupId?.zipcode !== 'Nationwide' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationItem;
