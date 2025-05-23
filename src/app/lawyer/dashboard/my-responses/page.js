'use client';
import React, { useEffect, useState } from 'react';
import LeadDetailsPage from '../_component/LeadsLeft';
import LeadsRight from '../_component/LeadsRight';
import { usePathname } from 'next/navigation';
import LeadsHead from '../_component/LeadsHead';
import data from '@/data/user';
import MyResponseDetails from './_components/MyResponseDetails';
import ResponseHead from './_components/ResponseHead';

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

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedResponse(data[0]); // Set first lead
    }
  }, [data]);

  return (
    <div className="continer">
      <div className="lead-board-wrap">
        <div className="lead-board-container">
          {showResponseDetails && selectedResponse && (
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
                  data={data}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyResponsePage;
