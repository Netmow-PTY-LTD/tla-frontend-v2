import React from 'react';
export default function AboutProfile({ data }) {
  if (!data?.bio) return null;
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

        .profile-about p {
          color: #374151;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .profile-about ul li{
        margin-bottom: 8px;
        }
        .profile-about ul li p{
        margin-bottom: 0;
        }

        .profile-about blockquote {
          color: #374151;
          line-height: 1.5;
          }

          .profile-about ul {
            color: #374151;
            line-height: 1.5;
          }

          .profile-about h1 {
            color: #374151;
            line-height: 1.5;
          }

            .profile-about h3 {
            color: #374151;
            line-height: 1.5;
          }

            .profile-about h4 {
            color: #374151;
            line-height: 1.5;
          }

            .profile-about h5 {
            color: #374151;
            line-height: 1.5;
          }

            .profile-about h6 {
            color: #374151;
            line-height: 1.5;
          }
          .profile-about p:not(:last-child) {
            margin-bottom: 10px;
          }
        `}
      </style>
    </section>
  );
}
