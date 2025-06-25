'use client';
import MainLayout from '@/components/main/common/layout';
import React from 'react';
import ProfileBanner from '../_components/ProfileBanner';
import AboutProfile from '../_components/AboutProfile';
import Link from 'next/link';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useParams } from 'next/navigation';
import { useGetUserProfileBySlugQuery } from '@/store/features/public/publicApiService';
import Image from 'next/image';

const DynamicProfilePage = () => {
  const params = useParams();
  console.log('DynamicProfilePage params', params);
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserProfileBySlugQuery(params?.slug);

  console.log('userInfo', userInfo);

  function extractYouTubeVideoId(url) {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?/]+)/;
    const match = url?.match(regex);
    return match?.[1] || null;
  }

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

      {/* Galleries Start*/}
      <section className="py-5 relative">
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
                {userInfo?.data?.photosVideos?.photos?.length > 0 ? (
                  userInfo?.data?.photosVideos?.photos.map((photo, index) => (
                    <Link href="#" key={`photo-${index}`}>
                      <img
                        src={photo || '/assets/img/gallery-placeholder.png'}
                        alt={`Gallery Image ${index + 1}`}
                        className="w-full h-[200px] rounded-lg object-cover"
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
        <div className="absolute top-0 right-0 hidden md:block">
          <Image
            src="/assets/img/experience-bg-shape.png"
            width={691}
            height={720}
            alt="shape"
          />
        </div>
      </section>
      {/* Experiences Start*/}
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
              {/* <div className="text-[16px] text-[#00C3C0] font-semibold">
                {userInfo?.data?.name?.split(' ')[0]} works across the spectrum
                of{' '}
                {userInfo?.data?.services?.map((service, index, arr) => (
                  <span key={index}>
                    {service}
                    {index < arr.length - 1 ? ', ' : ' '}
                  </span>
                ))}
                {''}
                matters, most notably in:
              </div> */}
              <div
                className="mt-4 prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black prose-p:text-gray-800 w-full text-base max-w-none"
                dangerouslySetInnerHTML={{
                  __html: userInfo?.data?.experience?.experience || '',
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Career Highlights Start */}
      <section className="py-5 relative">
        <div className="container">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12">
              <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
                <span>Career Highlights</span>
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
              {/* <div className="text-[16px] text-[#00C3C0] font-semibold">
                {`${userInfo?.data?.name?.split(' ')[0]}'s`}
                career highlights include:
              </div> */}
              <div
                className="mt-4 prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black prose-p:text-gray-800 w-full text-base max-w-none"
                dangerouslySetInnerHTML={{
                  __html: userInfo?.data?.experience?.experienceHighlight || '',
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 hidden md:block">
          <Image
            src="/assets/img/career-highlights-shape.png"
            width={691}
            height={720}
            alt="shape"
          />
        </div>
      </section>
      {/* Videos Start */}
      <section className="py-5">
        <div className="container">
          <div className="flex flex-wrap gap-5">
            <div className="w-full lg:w-8/12">
              <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
                <span>Videos</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {userInfo?.data?.photosVideos?.videos?.length > 0 ? (
                  userInfo?.data?.photosVideos?.videos.map((video, index) => {
                    const videoId = extractYouTubeVideoId(video);
                    return (
                      <div
                        key={`video-${index}`}
                        className="w-full aspect-video rounded-lg overflow-hidden"
                      >
                        {videoId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`YouTube video ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        ) : (
                          <div className="bg-gray-100 text-center text-sm text-gray-500 p-4 rounded-lg">
                            Invalid video URL
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-gray-500 italic">
                    No video is available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DynamicProfilePage;
