import React from 'react';
import ProfileProgress from './_components/ProfileProgress';
import About from './_components/About';
import Reviews from './_components/Reviews';
import Services from './_components/Services';
import Media from './_components/Media';
import SocialMediaLinks from './_components/SocialMediaLinks';
import Accreditations from './_components/Accreditations';
import QuestionsAndAnswers from './_components/QnA';

export default function Page() {
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
