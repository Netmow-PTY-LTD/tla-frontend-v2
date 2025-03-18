import Link from 'next/link';
import React from 'react';

const LeadBoardPage = () => {
  return (
    <div>
      <section>
        <h2>Founded 40 Matching Leads</h2>
        <div>
          <Link href={'#'}>
            {' '}
            <span>icon</span> Showing all 40 leads -{' '}
          </Link>{' '}
          |{' '}
          <div>
            <h2>Services: </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadBoardPage;
