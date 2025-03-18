import { MoveLeft } from 'lucide-react';
import React from 'react';

const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="bg-white">
      <section className="bg-[#F3F3F3] p-3">
        <div>
          <button className="flex py-2 items-center gap-2">
            {' '}
            <MoveLeft /> <span>Back to leads</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default page;
