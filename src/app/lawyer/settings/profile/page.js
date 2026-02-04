'use client';

import React, { Suspense, useMemo } from 'react';

import About from './_components/About';
import Reviews from './reviews/page';
import Services from './_components/Services';
import SocialMediaLinks from './_components/SocialMediaLinks';
import Accreditations from './_components/Accreditations';
import QuestionsAndAnswers from './_components/QnA';
import Media from './_components/Media';
import ProfileProgress from './_components/ProfileProgress';

import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import PublicProfile from './_components/PublicProfile';
import { Loader } from 'lucide-react';
import MediaTest from './_components/MediaTest';
import Agreement from './_components/Agreement';
import { useAuthUserInfoQuery } from '@/store/features/auth/authApiService';

export default function MyProfilePage() {
  const { data: userInfo, isLoading } = useAuthUserInfoQuery();

  const sectionProgress = useMemo(() => {
    const profile = userInfo?.data?.profile;
    if (!profile) return {};

    const calculateAboutProgress = () => {
      const fields = [
        profile.name,
        profile.designation,
        profile.bio,
        profile.phone,
        profile.gender,
        profile.profilePicture,
        profile.address,
        profile.lawyerContactEmail,
        profile.languages?.length > 0,
        profile.law_society_member_number,
        profile.practising_certificate_number,
      ];
      const filled = fields.filter(Boolean).length;
      return Math.round((filled / fields.length) * 100);
    };

    const calculateExperienceProgress = () => {
      const fields = [
        profile.experience?.years || profile.experience?.months,
        profile.experience?.experience,
        profile.experience?.experienceHighlight,
      ];
      const filled = fields.filter(Boolean).length;
      return Math.round((filled / fields.length) * 100);
    };

    const calculateSocialProgress = () => {
      const fields = [
        profile.socialMedia?.facebook,
        profile.socialMedia?.twitter,
        profile.socialMedia?.website,
      ];
      const filled = fields.filter(Boolean).length;
      return filled > 0 ? Math.round((filled / fields.length) * 100) : 0;
    };

    return {
      about: calculateAboutProgress(),
      services: profile.customService?.length > 0 ? 100 : 0,
      experience: calculateExperienceProgress(),
      media:
        profile.photos?.photos?.length > 0 || profile.photos?.videos?.length > 0
          ? 100
          : 0,
      social: calculateSocialProgress(),
      accreditations: profile.accreditation?.length > 0 ? 100 : 0,
      agreement: profile.agreement?.agreement ? 100 : 0,
      qa: profile.profileQA?.some((qa) => qa.answer?.length > 0) ? 100 : 0,
    };
  }, [userInfo]);

  const accordionItems = [
    {
      id: 'about',
      title: 'About',
      content: <About />,
      progress: sectionProgress.about,
    },
    {
      id: 'services',
      title: 'Services',
      content: <Services />,
      progress: sectionProgress.services,
    },
    {
      id: 'experiences-career-highlights',
      title: 'Experiences & Career Highlights',
      content: <PublicProfile />,
      progress: sectionProgress.experience,
    },
    {
      id: 'media',
      title: 'Photos & Videos',
      content: <MediaTest />,
      progress: sectionProgress.media,
    },
    {
      id: 'social',
      title: 'Social Media Links',
      content: <SocialMediaLinks />,
      progress: sectionProgress.social,
    },
    {
      id: 'accreditations',
      title: 'Accreditations or Legal Practising Certificates',
      content: <Accreditations />,
      progress: sectionProgress.accreditations,
    },
    {
      id: 'agreement',
      title: 'Agreement',
      content: <Agreement />,
      progress: sectionProgress.agreement,
    },
    {
      id: 'qa',
      title: 'Questions And Answers',
      content: <QuestionsAndAnswers />,
      progress: sectionProgress.qa,
    },
  ];

  return (
    <div>
      <ProfileProgress />
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-sm text-gray-500">
              <Loader /> Loading...
            </span>
          </div>
        }
      >
        <DynamicAccordion items={accordionItems} />
      </Suspense>
    </div>
  );
}
