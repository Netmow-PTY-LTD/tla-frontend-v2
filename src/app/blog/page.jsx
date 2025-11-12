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
  const seo = seoMetadata?.data || {};

  const metaTitle = seo.metaTitle || 'Blog Page | TheLawApp';
  const metaDescription =
    seo.metaDescription ||
    'Learn about TheLawApp — connecting clients and lawyers through a transparent legal marketplace.';
  const metaKeywords = seo.metaKeywords || ['blog', 'TheLawApp'];
  const metaImage =
    seo.metaImage ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/about.webp';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription, // ✔ fixed
      images: [{ url: metaImage }],
    },
    twitter: {
      card: 'summary_large_image', // ✔ fixed
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

export default async function BlogPage() {
  const seo = await getSeoData(seoData, 'blog');
  const schema = await generateSchemaBySlug('blog', seo);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlogPosts />
    </>
  );
}
