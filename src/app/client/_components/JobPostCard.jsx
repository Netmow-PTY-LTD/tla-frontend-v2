const posts = [
  {
    title: 'Family Lawyer',
    date: 'Monday, 28 April 2025',
    status: 'Approved',
    message: 'Congratulations! Your Job Post Is Approved.',
  },
  {
    title: 'Family Lawyer',
    date: 'Monday, 28 April 2025',
    status: 'Pending',
    message: 'Your Request Is Being Pending!',
  },
  {
    title: 'Family Lawyer',
    date: 'Monday, 28 April 2025',
    status: 'Rejected',
    message: '',
  },
  {
    title: 'Family Lawyer',
    date: 'Monday, 28 April 2025',
    status: 'Pending',
    message: 'Your Request Is Being Pending!',
  },
  {
    title: 'Family Lawyer',
    date: 'Monday, 28 April 2025',
    status: 'Rejected',
    message: '',
  },
  {
    title: 'Family Lawyer',
    date: 'Monday, 28 April 2025',
    status: 'Approved',
    message: 'Congratulations! Your Job Post Is Approved.',
  },
];

const statusStyles = {
  Approved: { bg: 'bg-green-700', text: 'Approved' },
  Pending: { bg: 'bg-orange-500', text: 'Pending' },
  Rejected: { bg: 'bg-red-600', text: 'Rejected' },
};

export default function JobPostCard({ lead }) {
  return (
    <div className="relative rounded-lg bg-gradient-to-bl from-white to-cyan-100 shadow p-[20px] w-full ">
      {/* Status Badge */}
      <div
        className={`absolute top-0 left-0  px-[10px] py-[5px] rounded-tl-[10px] rounded-br-[10px] text-white text-sm font-semibold  ${statusStyles[status]?.bg}`}
      >
        {statusStyles[status]?.text}
      </div>

      {/* Content */}
      <h3 className="text-[19px] font-semibold text-center">
        {lead?.serviceId?.name}
      </h3>
      <p className="text-sm text-center text-gray-500 mb-4">
        {lead?.serviceId?.createdAt &&
          (() => {
            const date = new Date(lead.serviceId.createdAt);
            const weekday = date.toLocaleDateString('en-GB', {
              weekday: 'long',
            });
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleDateString('en-GB', { month: 'long' });
            return `${weekday}, ${day} ${month}`;
          })()}
      </p>

      {/* <p className="text-center text-sm">
        {status === 'Rejected' ? (
          <>
            Sorry! Your job post is Rejected. Please email{' '}
            <a
              href="mailto:support@thelawapp.com"
              className="font-semibold text-[#00c3c0]"
            >
              support@thelawapp.com
            </a>
          </>
        ) : (
          message
        )}
      </p> */}

      {/* Button */}
      <div className="mt-6 flex justify-center">
        <button className="bg-[#00C3C0] text-white py-[8px] px-[30px] rounded hover:bg-[#00b0ad] transition">
          View Post
        </button>
      </div>
    </div>
  );
}
