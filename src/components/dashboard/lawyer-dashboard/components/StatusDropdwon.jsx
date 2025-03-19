import { Card } from '@/components/ui/card';
import DropdownMenu from '@/components/UIComponents/DropdownMenu';
import PropTypes from 'prop-types';

const statusColors = {
  pending: 'bg-yellow-500',
  hired: 'bg-green-500',
  rejected: 'bg-red-500',
  default: 'bg-gray-400',
};

const StatusDropdwon = ({ status = 'pending', menuItems }) => {
  return (
    <div className="flex items-center justify-between  bg-white border-[#DCE2EA]  px-3 py-2 rounded-lg">
      <h2 className="flex items-center text-lg font-medium">
        <span
          className={`w-2 h-2 rounded-full ${
            statusColors[status] || statusColors.default
          } mr-2`}
        ></span>
      </h2>
      {menuItems && <DropdownMenu menuItems={menuItems} />}
    </div>
  );
};

StatusDropdwon.propTypes = {
  status: PropTypes.string.isRequired,
  menuItems: PropTypes.array,
};

export default StatusDropdwon;
