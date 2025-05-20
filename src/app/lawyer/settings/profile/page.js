import React from 'react';

import About from './_components/About';
import Reviews from './reviews/page';
import Services from './_components/Services';
import SocialMediaLinks from './_components/SocialMediaLinks';
import Accreditations from './_components/Accreditations';
import QuestionsAndAnswers from './_components/QnA';
import Media from './_components/Media';
import ProfileProgress from './_components/ProfileProgress';

import AccordionComponent from '@/components/UIComponents/AcordionComponent';

export default function MyProfilePage() {
  return (
    <div>
      <ProfileProgress />
      <div className="space-y-[10px] ">
        <AccordionComponent content={<About />} title={'About'} />
        <AccordionComponent content={<Reviews />} title={'Reviews'} />
        <AccordionComponent content={<Services />} title={'Services'} />
        <AccordionComponent content={<Media />} title={'Media'} />
        <AccordionComponent
          content={<SocialMediaLinks />}
          title={'Social Media Links'}
        />
        <AccordionComponent
          content={<Accreditations />}
          title={'Accrditaions'}
        />
        <AccordionComponent
          content={<QuestionsAndAnswers />}
          title={'Questions And Answers'}
        />
      </div>
    </div>
  );
}
