import React, { Suspense } from 'react';

import About from './_components/About';
import Reviews from './reviews/page';
import Services from './_components/Services';
import SocialMediaLinks from './_components/SocialMediaLinks';
import Accreditations from './_components/Accreditations';
import QuestionsAndAnswers from './_components/QnA';
import Media from './_components/Media';
import ProfileProgress from './_components/ProfileProgress';

import { DynamicAccordion } from '@/components/UIComponents/AcordionComponent';
import Experiences from './_components/Experiences';
import PublicProfile from './_components/PublicProfile';
import { Loader } from 'lucide-react';

export default function MyProfilePage() {
  const accordionItems = [
    { id: 'about', title: 'About', content: <About /> },
    // { id: 'reviews', title: 'Reviews', content: <Reviews /> },
    { id: 'services', title: 'Services', content: <Services /> },
    {
      id: 'public-profile',
      title: 'Public Profile',
      content: <PublicProfile />,
    },
    { id: 'media', title: 'Photos', content: <Media /> },
    {
      id: 'social',
      title: 'Social Media Links',
      content: <SocialMediaLinks />,
    },
    {
      id: 'accreditations',
      title: 'Accreditations',
      content: <Accreditations />,
    },
    {
      id: 'qa',
      title: 'Questions And Answers',
      content: <QuestionsAndAnswers />,
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
