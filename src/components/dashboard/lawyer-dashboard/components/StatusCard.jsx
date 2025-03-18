import { Card } from '@/components/ui/card';
import DropdownMenu from '@/components/UIComponents/DropdownMenu';
import PropTypes from 'prop-types';

const statusColors = {
  pending: 'bg-yellow-500',
  hired: 'bg-green-500',
  rejected: 'bg-red-500',
  default: 'bg-gray-400',
};

const StatusCard = ({ status = 'pending', count, menuItems }) => {
  return (
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white shadow-md rounded-lg">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="flex items-center text-lg font-medium">
          <span
            className={`w-3 h-3 rounded-full ${
              statusColors[status] || statusColors.default
            } mr-2`}
          ></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </h2>
        {menuItems && <DropdownMenu menuItems={menuItems} />}
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-200" />

      {/* Card Content */}
      {count ? (
        <>
          <div className="bg-[#F5F6F9] flex flex-col justify-center items-center p-5 rounded-lg mx-4 my-3">
            <div className="flex items-center gap-2">
              <div>📈</div> {/* Replace with an actual icon if needed */}
              <h4 className="text-2xl font-bold text-black">{count}</h4>
            </div>
            <p className="text-sm text-gray-600 mt-1">{status} responses</p>
          </div>
        </>
      ) : (
        <></>
      )}
    </Card>
  );
};

StatusCard.propTypes = {
  status: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  menuItems: PropTypes.array,
};

export default StatusCard;
