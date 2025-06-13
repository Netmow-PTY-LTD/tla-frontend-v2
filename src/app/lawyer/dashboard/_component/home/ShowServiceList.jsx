import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const ShowServiceList = ({
  services = [],
  isLoading = false,
  isError = false,
  error,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 w-24 rounded-[5px] border border-gray-300"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
        <AlertCircle className="w-5 h-5" />
        <span>{error?.data?.message || 'Failed to load services.'}</span>
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="text-sm text-gray-500 italic">No services found.</div>
    );
  }

  const visibleServices = showAll ? services : services.slice(0, 3);
  const remainingCount = services.length - 3;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleServices.map((service, idx) => (
        <button
          key={idx}
          className="font-medium text-xs text-[#444444] rounded-[5px] border border-[#444444] px-[12px] py-[6px]"
        >
          {service?.name}
        </button>
      ))}

      {!showAll && services.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="font-medium text-xs text-[#444444] rounded-[5px] border border-dashed border-[#444444] px-[12px] py-[6px] bg-gray-50 hover:bg-gray-100 transition"
        >
          +{remainingCount} more
        </button>
      )}
    </div>
  );
};

export default ShowServiceList;
