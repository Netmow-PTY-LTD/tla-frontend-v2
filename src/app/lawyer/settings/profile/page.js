import React from 'react';

import About from './_components/About';
import Reviews from './reviews/page';
import Services from './_components/Services';
import SocialMediaLinks from './_components/SocialMediaLinks';
import Accreditations from './_components/Accreditations';
import QuestionsAndAnswers from './_components/QnA';
import Media from './_components/Media';
import ProfileProgress from './_components/ProfileProgress';

export default function MyProfilePage() {
  return (
    <>
      <ProfileProgress />
      <About />
      <Reviews />
      <Services />
      <Media />
      <SocialMediaLinks />
      <Accreditations />
      <QuestionsAndAnswers />
    </>
  );
}
