'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MyResponseDetails from './_components/MyResponseDetails';
import ResponseHead from './_components/ResponseHead';
import { useGetAllMyResponsesQuery } from '@/store/features/lawyer/ResponseApiService';
import { Inbox, Loader } from 'lucide-react';
import LeadsRight from './_components/ResponsesList';

const MyResponsePage = () => {
  const [showResponseDetails, setShowResponseDetails] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const cleanPathname = pathname?.trim().replace(/\/+$/, '');

    if (cleanPathname === '/lawyer/dashboard/my-responses') {
      window.scrollTo({ top: 0, behavior: 'auto' });

      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);

  const { data: allMyResponses, isLoading: isAllMyResponsesLoading } =
    useGetAllMyResponsesQuery();

  //console.log('allMyResponses', allMyResponses);

  useEffect(() => {
    if (allMyResponses?.data && allMyResponses?.data.length > 0) {
      setSelectedResponse(allMyResponses?.data[0]); // Set first lead
    }
  }, [allMyResponses?.data]);

  if (isAllMyResponsesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="flex items-center justify-center gap-2 text-[14px]">
          <Loader className="w-10 h-10 animate-spin" />
          loading...
        </span>
      </div>
    );
  }

  return (
    <div className="lead-board-wrap">
      {allMyResponses?.data && allMyResponses?.data?.length > 0 ? (
        <div className="lead-board-container">
          {showResponseDetails && (
            <div className="left-column-7">
              <div className="column-wrap-left">
                <MyResponseDetails
                  response={selectedResponse}
                  onBack={() => setShowResponseDetails(false)}
                />
              </div>
            </div>
          )}

          <div
            className={`${
              showResponseDetails ? 'right-column-5 ' : 'right-column-full'
            }`}
          >
            <div className="column-wrap-right">
              <div className="leads-top-row">
                <ResponseHead isExpanded={!showResponseDetails} />
              </div>
              <div className="leads-bottom-row">
                <LeadsRight
                  isExpanded={!showResponseDetails}
                  onViewDetails={(response) => {
                    setSelectedResponse(response);
                    setShowResponseDetails(true);
                  }}
                  data={allMyResponses?.data}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <Inbox className="w-12 h-12 mb-4 text-gray-400" />
          <h4 className="italic text-[18px] text-gray-500">
            Currently you have no responses.
          </h4>
        </div>
      )}
    </div>
  );
};

export default MyResponsePage;
