const statusStyles = {
  Approved: { bg: 'bg-green-700', text: 'Approved' },
  Pending: { bg: 'bg-orange-500', text: 'Pending' },
  Rejected: { bg: 'bg-red-600', text: 'Rejected' },
};

export default function JobPostCard({ title, date, status, message }) {
  return (
    <div className="relative rounded-lg bg-gradient-to-bl from-white to-cyan-100 shadow p-[13px] w-full ">
      {/* Status Badge */}
      <div
        className={`absolute top-0 left-0  px-[10px] py-[5px] rounded-tl-[10px] rounded-br-[10px] text-white text-sm font-semibold  ${statusStyles[status]?.bg}`}
      >
        {statusStyles[status]?.text}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-center mt-4">{title}</h3>
      <p className="text-sm text-center text-gray-500 mb-4">{date}</p>
      <p className="text-center text-sm">
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
      </p>

      {/* Button */}
      <div className="mt-6 flex justify-end">
        <button className="bg-[#00C3C0] text-white p-[10px] rounded hover:bg-[#00b0ad] transition">
          View Post
        </button>
      </div>
    </div>
  );
}
