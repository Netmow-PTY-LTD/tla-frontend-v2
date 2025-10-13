import { MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteLocationMutation } from '@/store/features/lawyer/locationApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const LocationItem = ({ location, onEdit, refetchLocations }) => {
  const [deleteLocation] = useDeleteLocationMutation();

  const handleDeleteLocation = async (locationId) => {
    if (locationId) {
      if (confirm('Are you sure you want to delete this location?')) {
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
            error?.data?.message ||
              'Failed to delete location. Please try again.'
          );
        }
      }
    }
  };
  return (
    <div className="flex items-start justify-between p-4 border-b bg-white border-gray-200">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <p className="text-gray-800">{location?.locationGroupId?.zipcode}</p>
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleDeleteLocation(location?._id)}
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default LocationItem;
