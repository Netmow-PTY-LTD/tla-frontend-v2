import React from 'react';
export default function AboutProfile({ data }) {
  return (
    <section className="pb-8 profile-about">
      <div className="flex flex-wrap">
        <div className="w-full">
          <h2 className="text-[#00C3C0] font-bold mb-4 profile-heading relative flex items-baseline gap-3">
            <span>About</span>
          </h2>
          <div
            className="text-[16px] text-black"
            dangerouslySetInnerHTML={{ __html: data?.bio || '' }}
          ></div>
        </div>
      </div>
      <style>
        {`
          .profile-about p:not(:last-child) {
            margin-bottom: 10px;
          }
        `}
      </style>
    </section>
  );
}
