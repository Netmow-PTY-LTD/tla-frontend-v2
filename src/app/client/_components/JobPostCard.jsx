const statusStyles = {
  Approved: { bg: 'bg-green-700', text: 'Approved' },
  Pending: { bg: 'bg-orange-500', text: 'Pending' },
  Rejected: { bg: 'bg-red-600', text: 'Rejected' },
};

export default function JobPostCard({ title, date, status, message }) {
  return (
    <div className="relative rounded-lg bg-gradient-to-br from-white to-cyan-50 shadow p-6 w-full max-w-md">
      {/* Status Badge */}
      <div
        className={`absolute top-2 left-2 px-3 py-1 text-white text-sm font-semibold rounded ${statusStyles[status]?.bg}`}
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
      <div className="mt-6 flex justify-center">
        <button className="bg-[#00c3c0] text-white px-4 py-2 rounded hover:bg-[#00b0ad] transition">
          View Post
        </button>
      </div>
    </div>
  );
}
