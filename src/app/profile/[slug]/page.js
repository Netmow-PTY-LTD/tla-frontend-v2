'use client';
import MainLayout from '@/components/main/common/layout';
import React from 'react';
import ProfileBanner from '../_components/ProfileBanner';
import AboutProfile from '../_components/AboutProfile';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetUserProfileBySlugQuery } from '@/store/features/public/publicApiService';
import Image from 'next/image';
import ProfilePhotoGallery from '../_components/ProfilePhotoGallery';
import Twitter from '@/components/icon/Twiiter';
import Facebook from '@/components/icon/Facebook';
import { Loader } from 'lucide-react';

const DynamicProfilePage = () => {
  const params = useParams();
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    isError,
    error,
    refetch,
  } = useGetUserProfileBySlugQuery(params?.slug);

  function extractYouTubeVideoId(url) {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?/]+)/;
    const match = url?.match(regex);
    return match?.[1] || null;
  }

  if (isUserInfoLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          loading...
        </span>
      </div>
    );
  }

  return (
    <MainLayout>
      {' '}
      <ProfileBanner data={userInfo?.data} />
      <div className="main-content pt-20">
        <div className="container">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 lg:pr-10">
              <AboutProfile data={userInfo?.data} />
              <ProfilePhotoGallery userInfo={userInfo} />
              <section className="py-5">
                <div className="flex flex-wrap">
                  <div className="w-full">
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
                    <div
                      className="mt-4 prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black prose-p:text-gray-800 w-full text-base max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: userInfo?.data?.experience?.experience || '',
                      }}
                    />
                  </div>
                </div>
              </section>
              {/* Career Highlights Start */}
              <section className="py-5 relative">
                <div className="flex flex-wrap">
                  <div className="w-full">
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
                    <div
                      className="mt-4 prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black prose-p:text-gray-800 w-full text-base max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          userInfo?.data?.experience?.experienceHighlight || '',
                      }}
                    />
                  </div>
                </div>
                <div className="absolute top-0 left-0 hidden md:block z-[-1]">
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
                <div className="flex flex-wrap gap-5">
                  <div className="w-full">
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
                        userInfo?.data?.photosVideos?.videos.map(
                          (video, index) => {
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
                          }
                        )
                      ) : (
                        <div className="col-span-full text-gray-500 italic">
                          No video is available.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="w-full lg:w-1/3 pl-8 flex gap-10 items-start">
              <div className="related-areas relative">
                <h2 className="text-[24px] font-semibold mb-4">
                  Related areas of expertise{' '}
                </h2>
                <div className="">
                  {Array.isArray(userInfo?.data?.services) &&
                  userInfo?.data?.services?.length > 0 ? (
                    userInfo?.data?.services?.map((service, index) => (
                      <div key={service + index}>
                        <span className="border border-gray-300 py-2 px-4 mr-2 mb-2 rounded-lg text-center inline-block">
                          {service}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">
                      No services available.
                    </div>
                  )}
                </div>
                <h2 className="text-[18px] font-semibold mb-4 mt-8">Share</h2>
                <div className="flex flex-wrap gap-5">
                  <Link
                    href={userInfo?.data?.socialMedia?.facebook || '#'}
                    className="mr-2 mb-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-6 h-6 text-gray-600" />
                  </Link>
                  <Link
                    href={userInfo?.data?.socialMedia?.twitter || '#'}
                    className="mr-2 mb-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-6 h-6 text-gray-600" />
                  </Link>
                  {/* <Link href={data?.socialMedia?.facebook || '#'} className="mr-2 mb-2">
                  <LinkedIn className="w-6 h-6 text-gray-600" />
                </Link>
              
                <Link href="#" className="mr-2 mb-2">
                  <Share className="w-6 h-6 text-gray-600" />
                </Link> */}
                </div>
              </div>
            </div>
            <style>
              {`
              .related-areas {
                position: relative;
                padding-left: 50px; /* Adjust as needed for spacing */
              }
              .related-areas::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 1px; 
                height: 100%;
                background-color: rgba(0, 204, 179, 0.20);
              }
            `}
            </style>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DynamicProfilePage;
