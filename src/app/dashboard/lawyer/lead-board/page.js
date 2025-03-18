import LeadCard from '@/components/dashboard/lawyer-dashboard/components/LeadCard';
import TagButton from '@/components/dashboard/lawyer-dashboard/components/TagButton';
import { Database, SlidersVertical } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const LeadBoardPage = () => {
  return (
    <div>
      <section className="px-4">
        <h1 className="font-bold text-lg md:text-2xl text-[#0B1C2D] text-center md:text-left">
          Founded 40 Matching Leads
        </h1>

        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center my-3 gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[#34495E] justify-center">
            <Link href="#" className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>Showing all 40 leads -</span>
            </Link>

            <span className="hidden md:inline">|</span>

            <div className="flex items-center gap-2">
              <h2>Services:</h2>
              <div className="inline-flex flex-wrap gap-2">
                <TagButton text="Family Law" bgColor="#FF86021A" />
                <TagButton text="Divorce Law" bgColor="#004DA61A" />
                <TagButton text="1+ more" bgColor="#7070701A" />
              </div>
            </div>

            <span className="hidden md:inline">|</span>

            <h2 className="text-center md:text-left">
              <span>Location:</span> Elgin St. Celina, Delaware...
            </h2>
          </div>

          <div>
            <button className="font-medium text-[#0194EF] flex items-center gap-2">
              <span>Filter Result</span> <SlidersVertical />
            </button>
          </div>
        </div>

        <hr className="border border-[#F3F3F3]" />
      </section>

      {/* lead card section */}
      <section>
        <LeadCard />
      </section>
    </div>
  );
};

export default LeadBoardPage;
