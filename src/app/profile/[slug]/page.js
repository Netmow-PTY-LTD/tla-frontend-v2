'use client';
import MainLayout from '@/components/main/common/layout';
import React, { useEffect } from 'react';
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
import ProfileServices from '../_components/ProfileServices';
import Preloader from '@/components/Preloader';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';
import { useSelector } from 'react-redux';
import { useVisitProfileMutation } from '@/store/features/visitorTracker/visitorTracker';
import { checkValidity } from '@/helpers/validityCheck';


const DynamicProfilePage = () => {
  const params = useParams();
  const token = useSelector((state) => state.auth.token);
  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    isError,
    error,
    refetch,
  } = useGetUserProfileBySlugQuery(params?.slug);

  console.log('userInfo ===>', userInfo?.data?.userId)

  function extractYouTubeVideoId(url) {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?/]+)/;
    const match = url?.match(regex);
    return match?.[1] || null;
  }

  //   if valid token then call curren user api
  const isValidToken = checkValidity(token)
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useAuthUserInfoQuery(undefined, { skip: !isValidToken });

  const [visitProfile] = useVisitProfileMutation();
  // ✅ Trigger visit API only when user is valid and profile is loaded
  useEffect(() => {
    const targetId = userInfo?.data?.userId;
    const visitorId = currentUser?.data?._id;

    if (
      isValidToken &&    // ✅ Only if logged in
      targetId &&
      visitorId &&
      targetId !== visitorId // ✅ Avoid visiting own profile
    ) {
      const trackVisit = async () => {
        try {
          await visitProfile({ targetId }).unwrap();
        } catch (error) {
          console.error("Error visiting profile:", error);
        }
      };

      trackVisit();
    }



  }, [isValidToken, userInfo?.data?.userId, currentUser?.data?._id, visitProfile]);



  if (isUserInfoLoading) {
    return <Preloader />;
  }

  return (
    <MainLayout>
      {' '}
      <ProfileBanner
        data={userInfo?.data}
        currentUser={currentUser}
        token={token}
      />
      <div className="main-content pt-20">
        <div className="container">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 lg:pr-10">
              <AboutProfile data={userInfo?.data} />
              <ProfileServices data={userInfo?.data} />
              <ProfilePhotoGallery userInfo={userInfo} />
              {/* Experiences Start */}
              {userInfo?.data?.experience?.experience && (
                <section className="py-5 profile-experience">
                  <div className="flex flex-wrap">
                    <div className="w-full">
                      <h2 className="text-[#00C3C0] font-bold mb-4 profile-heading relative flex items-baseline gap-3">
                        <span>Experiences</span>
                      </h2>
                      <div
                        className="mt-4 prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black w-full text-base max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: userInfo?.data?.experience?.experience || '',
                        }}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Career Highlights Start */}
              {userInfo?.data?.experience?.experienceHighlight && (
                <section className="py-5 relative profile-experience">
                  <div className="flex flex-wrap">
                    <div className="w-full">
                      <h2 className="text-[#00C3C0] font-bold mb-4 profile-heading relative flex items-baseline gap-3">
                        <span>Career Highlights</span>
                      </h2>
                      <div
                        className="mt-4 prose prose-sm prose-headings:font-semibold prose-ul:list-disc prose-li:marker:text-black w-full text-base max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            userInfo?.data?.experience?.experienceHighlight ||
                            '',
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
              )}

              {userInfo?.data?.photosVideos?.videos?.length > 0 && (
                <section className="py-5">
                  <div className="flex flex-wrap gap-5">
                    <div className="w-full">
                      <h2 className="text-[#00C3C0] font-bold mb-4 profile-heading relative flex items-baseline gap-3">
                        <span>Videos</span>
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
              )}
              {/* Videos Start */}
            </div>
            <div className="w-full lg:w-1/3 pl-8 flex gap-10 items-start">
              <div className="related-areas relative">
                {userInfo?.data?.languages?.length > 0 && (
                  <>
                    <h4 className="font-semibold mb-4">Languages</h4>
                    <div className="flex flex-wrap mb-4">
                      {Array.isArray(userInfo?.data?.languages) &&
                        userInfo?.data?.languages?.length > 0 ? (
                        userInfo?.data?.languages?.map((language, index) => (
                          <div key={language + index}>
                            <span className="py-2 px-4 mr-2 mb-2 rounded-lg inline-block bg-[#095761] text-white">
                              {language}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">
                          No languages available.
                        </div>
                      )}
                    </div>
                  </>
                )}
                {userInfo?.data?.services?.length > 0 && (
                  <>
                    <h4 className="font-semibold mb-4">
                      Related areas of expertise{' '}
                    </h4>
                    <div className="">
                      {Array.isArray(userInfo?.data?.services) &&
                        userInfo?.data?.services?.length > 0 ? (
                        userInfo?.data?.services?.map((service, index) => (
                          <div key={service + index}>
                            <span className="py-2 px-4 mr-2 mb-2 rounded-lg inline-block chip">
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
                  </>
                )}
                {userInfo?.data?.socialMedia && (
                  <>
                    <h2 className="text-[18px] font-semibold mb-4 mt-8">
                      Share
                    </h2>
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
                  </>
                )}
              </div>
            </div>
            <style>
              {`
              .related-areas {
                position: relative;
                padding-left: 40px;
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

              .related-areas .chip{
                background-color: hsl(0deg 0% 85.07% / 20%);
                color: #000000;
              }

              .profile-experience p{
                margin: 0 !important;
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
