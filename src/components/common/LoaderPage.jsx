import { Loader2 } from 'lucide-react';

const LoaderPage = () => {
  return (
    <div className="flex items-center justify-center ">
      <Loader2 className="animate-spin text-teal-500 w-14 h-14" />
    </div>
  );
};

export default LoaderPage;
