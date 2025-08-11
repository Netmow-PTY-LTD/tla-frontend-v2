import React from 'react';

export default function ClientRequests() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Requests</h2>
      <div className="max-w-[1100px] mx-auto">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex-1 flex items-start justify-between mb-4 py-3 px-4 rounded-lg border border-gray-200">
            <div className="flex flex-col">
              <div className="text-gray-500 mb-1">Title</div>
              <div className="text-sm text-black font-medium">Message</div>
            </div>
          </div>
        </div>
        {/* {paginatedData?.length === 0 && <p>No notifications found.</p>}
        {paginatedData?.length > 0 && (
          <div className="flex justify-center gap-1 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-80"
            >
              Prev
            </button>

            {pageNumbers.map((page, index) =>
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded ${
                    currentPage === page ? 'bg-black text-white' : ''
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-80"
            >
              Next
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
