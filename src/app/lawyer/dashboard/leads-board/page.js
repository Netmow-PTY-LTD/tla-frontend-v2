import LeadCard from '@/components/dashboard/seller/components/LeadCard';
import TagButton from '@/components/dashboard/seller/components/TagButton';
import { Database, SlidersVertical } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const LeadBoardPage = () => {
  return (
    <div className="continer">
      <section className="lg:px-4">
        <h1 className="font-bold text-lg md:text-2xl text-[#0B1C2D] text-center lg:text-left">
          Found 40 Matching Leads
        </h1>

        <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center my-3 gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[#34495E] justify-center">
            <Link href="#" className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>Showing all 40 leads -</span>
            </Link>

            <span className="hidden lg:inline">|</span>

            <div className="lg:flex items-center gap-2">
              <h2 className="text-center lg:text-balance">Services:</h2>
              <div className="inline-flex flex-wrap gap-2">
                <TagButton text="Family Law" bgColor="#FF86021A" />
                <TagButton text="Divorce Law" bgColor="#004DA61A" />
                <TagButton text="1+ more" bgColor="#7070701A" />
              </div>
            </div>

            <span className="hidden lg:inline">|</span>

            <h2 className="text-center md:text-left">
              <span>Location:</span> Elgin St. Celina, Delaware...
            </h2>
          </div>

          <div>
            <Link href={'/dashboard/lawyer/lead-board/lead-seetings'}>
              <button className="font-medium text-[#0194EF] flex items-center gap-2">
                <span>Filter Result</span> <SlidersVertical />
              </button>
            </Link>
          </div>
        </div>

        <hr className="border border-[#F3F3F3]" />
      </section>

      {/* lead card section */}
      <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5  5xl:grid-cols-6 6xl:grid-cols-8 gap-5 lg:px-4 mt-4 mb-10">
        <LeadCard />
        <LeadCard />
        <LeadCard />
        <LeadCard />
        <LeadCard />
        <LeadCard />
      </section>
    </div>
  );
};

export default LeadBoardPage;
