import React, { Suspense } from 'react';
import BlogPostDetails from '../_components/BlogDetails';
import BlogPosts from '../_components/BlogPosts';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import { getSeoData } from '@/helpers/getSeoData';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/main/common/layout';

import seoData from '@/data/seoData';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const isPageNumber = /^\d+$/.test(slug);

  if (isPageNumber) {
    const pageNum = parseInt(slug);
    const pageSeoData = await getSeoData(seoData, 'blog'); // Correct usage
    return {
      title: `${pageSeoData?.title || 'Blog'} - Page ${pageNum}`,
      description: pageSeoData?.description,
      openGraph: {
        title: `${pageSeoData?.title || 'Blog'} - Page ${pageNum}`,
        description: pageSeoData?.description,
      },
    };
  }

  // Fetch blog data for slug
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/blog/${slug}`
  );
  const blogData = await result.json();
  const post = blogData?.data || {};
  const seo = post?.seo || {};

  const title = seo.metaTitle || post.title || 'Blog Post | TheLawApp';
  const description =
    seo.metaDescription ||
    post.excerpt ||
    'Read the latest legal insights and updates from TheLawApp.';
  const image =
    seo.metaImage ||
    post.featuredImage?.url ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/blog.webp';
  const keywords = Array.isArray(seo.metaKeywords)
    ? seo.metaKeywords.join(', ')
    : seo.metaKeywords || 'law, legal, TheLawApp';

  const canonicalUrl =
    seo.canonicalUrl ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug || slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.authors || ['TheLawApp'],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const isPageNumber = /^\d+$/.test(slug);

  if (isPageNumber) {
    return (
      <MainLayout>
        <BlogPosts currentPage={parseInt(slug)} />
      </MainLayout>
    );
  }

  let defaultSchema = null;
  let customSchema = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/blog/${slug}`
    );
    const blogData = await res.json();
    const post = blogData?.data || {};
    const seo = post?.seo || {};

    // Generate default schema
    defaultSchema = await generateSchemaBySlug('blogPost', post);

    // Custom schema from API
    customSchema = post.seoSchema || seo.seoSchema;
  } catch (error) {
    console.error('Failed to fetch blog data for schema (SSR):', error);
  }

  return (
    <>
      {defaultSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(defaultSchema),
          }}
        />
      )}
      {customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(customSchema),
          }}
        />
      )}
      <MainLayout>
        <BlogPostDetails slug={slug} />
      </MainLayout>
    </>
  );
}
