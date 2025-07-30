import { MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationItem = ({ location }) => {
  return (
    <div className="flex items-start justify-between p-4 border-b bg-white border-gray-200">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
        <div>
          <p className="text-gray-800">{location?.locationGroupId?.zipcode}</p>
          <div className="flex gap-2 mt-1">
            <button className="text-teal-500 text-sm">View on map</button>
            <span className="text-gray-400">·</span>
            {location?.locationGroupId?.zipcode !== 'Nationwide' ? (
              <button className="text-teal-500 text-sm">Remove</button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex gap-2">
        {location?.locationGroupId?.zipcode !== 'Nationwide' ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        ) : (
          <></>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4 text-gray-500" />
        </Button>
      </div> */}
    </div>
  );
};

export default LocationItem;
