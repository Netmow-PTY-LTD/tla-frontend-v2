import React from 'react';
import BlogPosts from './_components/BlogPosts';
import { getSeoData } from '@/helpers/getSeoData';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import seoData from '@/data/seoData';

export async function generateMetadata() {
  const slug = 'blog';
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`
  );
  const seoMetadata = await res.json();
  const data = seoMetadata?.data || {};
  const seo = data.seo || data; // Robust check for nested seo object

  const metaTitle = seo.metaTitle || 'Blog Page | TheLawApp';
  const metaDescription =
    seo.metaDescription ||
    'Learn about TheLawApp — connecting clients and lawyers through a transparent legal marketplace.';
  const metaKeywords = seo.metaKeywords || ['blog', 'TheLawApp'];
  const metaImage =
    seo.metaImage ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/about.webp';

  const canonicalUrl =
    seo.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blog`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [{ url: metaImage }],
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

export default async function BlogPage() {
  const data = await getSeoData(seoData, 'blog');
  const seo = data.seo || data; // Robust check for nested seo object
  const schema = await generateSchemaBySlug('blog', seo);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      {(data?.seoSchema || seo?.seoSchema) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.seoSchema || seo.seoSchema),
          }}
        />
      )}
      <BlogPosts />
    </>
  );
}
