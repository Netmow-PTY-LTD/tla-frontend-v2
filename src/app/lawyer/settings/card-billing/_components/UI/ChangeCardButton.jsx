import { Plus } from 'lucide-react';

const ChangeCardButton = () => {
  return (
    <div className="w-80 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center">
          <Plus className="w-6 h-6 text-gray-600" />
        </div>
        <span className="text-gray-700 font-medium">Change Card</span>
      </div>
    </div>
  );
};

export default ChangeCardButton;
