'use client';
import MainLayout from '@/components/main/common/layout';
import React from 'react';
import ProfileBanner from '../_components/ProfileBanner';
import AboutProfile from '../_components/AboutProfile';
import Link from 'next/link';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useParams } from 'next/navigation';
import { useGetUserByIdQuery } from '@/store/features/public/publicApiService';

const DynamicProfilePage = () => {
  const params = useParams();
  const id = params?.id;

  console.log('DynamicProfilePage params', params);
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserByIdQuery(params?.slug);

  console.log('userInfo', userInfo);

  console.log('userInfo', userInfo?.data?.profile?.photos);
  return (
    <MainLayout>
      <div
        style={{
          backgroundImage: 'url("/assets/img/about-profile-shape.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {' '}
        <ProfileBanner data={userInfo?.data} />
        <AboutProfile data={userInfo?.data} />
      </div>
      <section
        className="py-5"
        style={{
          backgroundImage: 'url("/assets/img/experience-bg-shape.png")',
          backgroundSize: 'auto 50%',
          backgroundPosition: 'right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container">
          <div className="flex flex-wrap gap-5">
            <div className="w-full lg:w-8/12">
              <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
                <span>Galleries</span>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {userInfo?.data?.profile?.photos?.length > 0 ? (
                  userInfo.data.photos.map((photo, index) => (
                    <Link href="#" key={`photo-${index}`}>
                      <img
                        src={
                          photo?.url || '/assets/img/gallery-placeholder.png'
                        }
                        alt={`Gallery Image ${index + 1}`}
                        className="w-full h-auto rounded-lg"
                      />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-gray-500 italic">
                    No photos available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12">
              <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
                <span>Experiences</span>
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
              <div className="text-[16px] text-[#00C3C0] font-semibold">
                Collette works across the spectrum of family & relationship law
                matters, most notably in:
              </div>
              <div className="mt-4">
                {`Prior to joining Lander & Rogers Collette served as the
                associate to a judge of the Federal Circuit Court of Australia
                (as it then was) and later worked at a prominent Sydney-based
                family law firm. In her earlier career, Collette held a senior
                management position in Audit & Risk Management with a publicly
                listed company which, coupled with her specialist family law
                experience, gives her a unique understanding and perspective in
                matters featuring commercial elements. Her background and
                experience have led to an extensive and loyal referral base of
                financial service providers, accountants and therapeutic
                professionals, with whom she regularly collaborates for the
                mutual benefit of her clients. Collette is regularly nominated
                for industry awards and is recognised in national publications
                as one of a select number of leading Australian family law
                practitioners. She was named a finalist in the 2018 and 2019
                Lawyer’s Weekly Partner of the Year Awards and was ranked as a
                leading family lawyer in all the individual lawyer categories of
                the 2022-2025 editions of the national peer-reviewed Doyle's
                Guide, including in both the national and New South Wales
                listings. Prior to joining Lander & Rogers Collette served as
                the associate to a judge of the Federal Circuit Court of
                Australia (as it then was) and later worked at a prominent
                Sydney-based family law firm. In her earlier career, Collette
                held a senior management position in Audit & Risk Management
                with a publicly listed company which, coupled with her
                specialist family law experience, gives her a unique
                understanding and perspective in matters featuring commercial
                elements. Her background and experience have led to an extensive
                and loyal referral base of financial service providers,
                accountants and therapeutic professionals, with whom she
                regularly collaborates for the mutual benefit of her clients.
                Collette is regularly nominated for industry awards and is
                recognised in national publications as one of a select number of
                leading Australian family law practitioners. She was named a
                finalist in the 2018 and 2019 Lawyer’s Weekly Partner of the
                Year Awards and was ranked as a leading family lawyer in all the
                individual lawyer categories of the 2022-2025 editions of the
                national peer-reviewed Doyle's Guide, including in both the
                national and New South Wales listings.`}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DynamicProfilePage;
