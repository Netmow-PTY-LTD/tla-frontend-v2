import React from 'react';
export default function AboutProfile({ data }) {
  return (
    <section className="pb-8">
      <div className="flex flex-wrap">
        <div className="w-full">
          <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
            <span>About</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="62"
              height="4"
              viewBox="0 0 62 4"
              fill="none"
            >
              <rect
                x="0.138672"
                y="0.201172"
                width="11.3115"
                height="3.40625"
                rx="1.70312"
                fill="#D9D9D9"
              />
              <rect
                x="17.4512"
                y="0.201172"
                width="44.5493"
                height="3.40625"
                rx="1.70312"
                fill="#00C3C0"
              />
            </svg>
          </h2>
          <div className="text-[16px] text-black">{data?.bio || ''}</div>
        </div>
      </div>
    </section>
  );
}
