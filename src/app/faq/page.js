import MainLayout from '@/components/main/common/layout';
import React from 'react';
import FaqTabs from './_components/FaqTabs';
import SectionHeading from '@/components/main/home/SectionHeading';
import HomeCTA from '@/components/main/home/HomeCTA';
import PageBanner from '@/components/common/PageBanner';
import { getSeoData } from '@/helpers/getSeoData';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import seoData from '@/data/seoData';

async function getFaqData() {
  try {
    const categories = ['general', 'client', 'lawyer'];
    const result = { general: [], client: [], lawyer: [] };

    for (const category of categories) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/website-faq/public?category=${category}&limit=1000`,
        { next: { revalidate: 3600 } }
      );

      if (res.ok) {
        const data = await res.json();
        // Handle different response formats
        if (data?.data) {
          // Check if data.data is an array (paginated) or object (grouped)
          if (Array.isArray(data.data)) {
            result[category] = data.data;
          } else if (typeof data.data === 'object') {
            result[category] = data.data;
          }
        } else if (Array.isArray(data)) {
          result[category] = data;
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return { general: [], clients: [], lawyers: [] };
  }
}

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
  const faqData = await getFaqData();
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

          <FaqTabs
            clientsData={faqData.client || []}
            lawyersData={faqData.lawyer || []}
            generalData={faqData.general || []}
          />
        </div>
        <HomeCTA />
      </MainLayout>
    </>
  );
}
