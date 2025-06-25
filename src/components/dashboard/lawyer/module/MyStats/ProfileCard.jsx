// 'use client';
// import PencilIcon from '@/assets/icon';
// import { Card } from '@/components/ui/card';
// import Image from 'next/image';
// import Link from 'next/link';
// import React from 'react';

// const ProfileCard = ({ profile, isLoading, isError, error }) => {
//   // console.log('profile', profile);
//   return (
//     // figma base
//     <Card>
//       <div className="p-3 space-y-5">
//         <figure className="w-20 h-20 rounded-full overflow-hidden">
//           <Image
//             src={
//               profile?.profile?.profilePicture
//                 ? profile?.profile?.profilePicture
//                 : '/assets/img/auth-step1.png'
//             }
//             alt={profile?.profile?.name ?? 'User'}
//             width={80}
//             height={80}
//             priority
//             className="rounded-full object-cover"
//           />
//         </figure>
//         <h3 className="font-medium heading flex items-center">
//           {profile?.profile?.name}{' '}
//           <Link
//             href={'/lawyer/settings/profile'}
//             aria-label="Edit Name"
//             className="ml-3 rounded "
//           >
//             <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
//           </Link>
//         </h3>
//         {/* <div className="font-medium heading-base flex items-center">
//           Personal Details{' '}
//           <Link
//             href={'/lawyer/settings/profile'}
//             aria-label="Edit Name"
//             className="ml-3 rounded "
//           >
//             <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
//           </Link>
//         </div> */}

//         <div className="space-y-4 text-[#34495E]">
//           <p className="heading-base">
//             {' '}
//             Phone: {profile?.profile?.phone} (Verified)
//           </p>
//           <p className="heading-base"> Email: {profile?.email}</p>
//           <p className="heading-base"> Address: {profile?.profile?.address} </p>
//         </div>
//         <hr className="tet-[#F3F3F3] border" />
//       </div>
//       <div className="p-3">
//         <div className="mb-4">
//           <h4 className="font-medium heading flex items-center">
//             About Description{' '}
//             <Link
//               href={'/lawyer/settings/profile'}
//               aria-label="Edit Name"
//               className="ml-3 rounded "
//             >
//               <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
//             </Link>
//           </h4>
//           <div className="p-3 bg-[#F3F3F3] mt-5 rounded-lg ">
//             <p className="heading-base">
//               {profile?.profile?.bio
//                 ? profile?.profile?.bio
//                 : "If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understandyour rights and options."}
//             </p>
//           </div>
//         </div>
//         <hr className="tet-[#F3F3F3] border" />
//         <div className="space-y-4 my-5">
//           <h4 className="font-medium heading flex items-center">
//             Professional Details{' '}
//             <Link
//               href={'/lawyer/settings/profile'}
//               aria-label="Edit Name"
//               className="ml-3 rounded "
//             >
//               <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
//             </Link>
//           </h4>
//           <p>Company Name: {profile?.profile?.companyProfile?.companyName}</p>
//           <p>
//             Company Address:{' '}
//             {profile?.profile?.companyProfile?.location?.address}
//           </p>
//           <p>Website URL: {profile?.profile?.companyProfile?.website}</p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ProfileCard;

'use client';
import PencilIcon from '@/assets/icon';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProfileCard = ({ profile, isLoading, isError, error }) => {
  // console.log('profile', profile);
  return (
    // figma base
    <Card>
      <div className="p-3 space-y-5">
        <figure className="w-20 h-20 rounded-full overflow-hidden">
          <Image
            src={
              profile?.profile?.profilePicture
                ? profile?.profile?.profilePicture
                : '/assets/img/auth-step1.png'
            }
            alt={profile?.profile?.name ?? 'User'}
            width={80}
            height={80}
            priority
            className="rounded-full object-cover"
          />
        </figure>
        <h3 className="font-medium heading flex items-center">
          {profile?.profile?.name}{' '}
          <Link
            href={'/lawyer/settings/profile'}
            aria-label="Edit Name"
            className="ml-3 rounded "
          >
            <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
          </Link>
        </h3>

        <div className="space-y-4 text-[#34495E]">
          <p className="heading-base">
            {' '}
            Phone: {profile?.profile?.phone} (Verified)
          </p>
          <p className="heading-base"> Email: {profile?.email}</p>
          <p className="heading-base"> Address: {profile?.profile?.address} </p>
        </div>
        <hr className="tet-[#F3F3F3] border" />
      </div>
      <div className="p-3">
        <div className="space-y-4 my-5">
          <h4 className="font-medium  text-lg flex items-center">
            Company Details{' '}
            <Link
              href={'/lawyer/settings/profile'}
              aria-label="Edit Name"
              className="ml-3 rounded "
            >
              <PencilIcon className="text-[#919FAC] hover:text-black transition w-5 h-5 rounded-full" />
            </Link>
          </h4>
          {profile?.profile?.companyProfile?.companyName && (
            <p>Name: {profile.profile.companyProfile.companyName}</p>
          )}

          {profile?.profile?.companyProfile?.location?.address && (
            <p>Address: {profile.profile.companyProfile.location.address}</p>
          )}

          {profile?.profile?.companyProfile?.website && (
            <p>Website: {profile.profile.companyProfile.website}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
