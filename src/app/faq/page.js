import MainLayout from '@/components/main/common/layout';
import React from 'react';
import Faqs from './_components/Faqs';
import SectionHeading from '@/components/main/home/SectionHeading';
import { clientsfaqsData, lawyerfaqsData } from '@/data/data';
import HomeCTA from '@/components/main/home/HomeCTA';
import Link from 'next/link';
import PageBanner from '@/components/common/PageBanner';
import { getSeoData } from '@/helpers/getSeoData';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import seoData from '@/data/seoData';

export async function generateMetadata() {
  const slug = 'faq';

  // Fetch SEO data from your API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`
  );
  const seoMetadata = await res.json();
  const seo = seoMetadata?.data || {};

  const metaTitle = seo.metaTitle || 'FAQ | TheLawApp';
  const metaDescription =
    seo.metaDescription ||
    'Frequently Asked Questions about TheLawApp — learn how to get started, find lawyers, and navigate the legal marketplace.';
  const metaKeywords = seo.metaKeywords || [
    'FAQ',
    'TheLawApp',
    'legal questions',
  ];
  const metaImage =
    seo.metaImage ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/faq.webp';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [{ url: metaImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

export default async function FaqPage() {
  const seo = await getSeoData(seoData, 'faq');
  const schema = await generateSchemaBySlug('faq', seo);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <MainLayout>
        <PageBanner
          title="Frequently Asked Questions"
          subtitle={'Legal Help Made Clear'}
          bgImage={'/assets/img/faq-bg.webp'}
          paragraph={`Got questions about legal services, posting a case, or connecting with lawyers? Our FAQ section provides clear answers to help clients and legal professionals navigate the platform with confidence and ease.`}
        />
        <div className="mt-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="We've got answers!"
            className="mb-10"
          />

          <section className="my-16">
            <h3 className="text-2xl font-semibold  border-b border-gray-300 pb-3">
              For Clients
            </h3>
            <Faqs data={clientsfaqsData} />
          </section>

          <section>
            <h3 className="text-2xl font-semibold  border-b border-gray-300 pb-3">
              For Lawyers
            </h3>
            <Faqs data={lawyerfaqsData} />
          </section>
        </div>
        <HomeCTA />
      </MainLayout>
    </>
  );
}
