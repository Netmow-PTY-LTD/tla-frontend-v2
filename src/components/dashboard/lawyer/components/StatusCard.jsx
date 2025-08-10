// import { Card } from '@/components/ui/card';
// import DropdownMenu from '@/components/UIComponents/DropdownMenu';
// import PropTypes from 'prop-types';

// const statusColors = {
//   pending: 'bg-yellow-500',
//   hired: 'bg-green-500',
//   rejected: 'bg-red-500',
//   default: 'bg-gray-400',
// };

// const StatusCard = ({ status = 'pending', count, menuItems }) => {
//   return (
//     <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto bg-white shadow-md rounded-lg">
//       {/* Card Header */}
//       <div className="flex items-center justify-between p-4">
//         <h2 className="flex items-center text-lg font-medium">
//           <span
//             className={`w-3 h-3 rounded-full ${
//               statusColors[status] || statusColors.default
//             } mr-2`}
//           ></span>
//           {status.charAt(0).toUpperCase() + status.slice(1)}
//         </h2>
//         {menuItems && <DropdownMenu menuItems={menuItems} />}
//       </div>

//       {/* Divider */}
//       <hr className="border-t border-gray-200" />

//       {/* Card Content */}
//       {count ? (
//         <>
//           <div className="bg-[#F5F6F9] flex flex-col justify-center items-center p-5 rounded-lg mx-4 my-3">
//             <div className="flex items-center gap-2">
//               <div>📈</div> {/* Replace with an actual icon if needed */}
//               <h4 className="text-2xl font-bold text-black">{count}</h4>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">{status} responses</p>
//           </div>
//         </>
//       ) : (
//         <></>
//       )}
//     </Card>
//   );
// };

// StatusCard.propTypes = {
//   status: PropTypes.string.isRequired,
//   count: PropTypes.number.isRequired,
//   menuItems: PropTypes.array,
// };

// export default StatusCard;

import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import DropdownMenu from '@/components/UIComponents/DropdownMenu';
import { MapPin } from 'lucide-react';
import PropTypes from 'prop-types';

const statusColors = {
  pending: 'bg-yellow-500',
  hired: 'bg-green-500',
  rejected: 'bg-red-500',
  default: 'bg-gray-400',
};

const defaultServices = ['Family Law', 'Criminal Defense', 'Immigration Law'];

const defaultLocations = ['10001', '90210', '30301'];

const StatusCard = ({ status = 'pending', count, menuItems }) => {
  return (
    <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto bg-white shadow-md rounded-lg">
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

      <div>
        {/* Header */}
        <div className="m-3 flex justify-between items-center flex-wrap">
          <h2 className="font-medium text-lg">Skill Settings</h2>
          <h2 className="text-sm sm:text-base">
            <span>456</span> New cases
          </h2>
        </div>
        <hr className="border-[#F3F3F3] border" />

        {/* Practice Area */}
        <div className="m-3">
          <h1 className="font-medium flex items-center text-lg">
            Practice Area
            <button aria-label="Edit Practice Area" className="ml-3 rounded">
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </button>
          </h1>
          <p className="my-2 text-sm sm:text-base">
            You'll receive cases in these categories
          </p>

          <div className="inline-flex flex-wrap gap-2 mt-2">
            {defaultServices.map((service, index) => (
              <span
                key={index}
                className="bg-[#F3F3F3] text-sm px-3 py-1 rounded-full text-[#0B1C2D]"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
        <hr className="border-[#F3F3F3] border" />

        {/* Locations */}
        <div className="m-3">
          <h1 className="font-medium flex items-center text-lg">
            Locations
            <button aria-label="Edit Locations" className="ml-3 rounded">
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </button>
          </h1>
          <p className="my-2 text-sm sm:text-base">
            You're receiving customers within
          </p>

          <div className="mt-[15px] space-y-3">
            {defaultLocations.map((zip, index) => (
              <p
                key={index}
                className="text-[#0B1C2D] bg-[#F3F3F3] rounded-lg p-4 flex items-center"
              >
                <MapPin className="mr-2 w-4 h-4 text-gray-600" />
                <span>{zip}</span>
              </p>
            ))}
          </div>
        </div>
        <hr className="border-[#F3F3F3] border" />

        {/* CTA Button */}
        <div className="m-3">
          <button className="px-[19px] py-2 text-[#0B1C2D] font-medium bg-[#EDF0F4] rounded-full text-sm sm:text-base">
            View Cases
          </button>
        </div>
      </div>
    </Card>
  );
};

StatusCard.propTypes = {
  status: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  menuItems: PropTypes.array,
};

export default StatusCard;
