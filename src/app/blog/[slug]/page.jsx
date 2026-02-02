import React, { Suspense } from 'react';
import BlogPostDetails from '../_components/BlogDetails';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import { Loader2 } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/blog/${slug}`
  );
  const blogData = await res.json();
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/blog/${slug}`
  );
  const blogData = await res.json();
  const post = blogData?.data || {};
  const seo = post?.seo || {};

  // Generate default schema
  const defaultSchema = await generateSchemaBySlug('blogPost', post);

  // Custom schema from API (could be in post.seoSchema or seo.seoSchema)
  const customSchema = post.seoSchema || seo.seoSchema;

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
      <BlogPostDetails slug={slug} />
    </>
  );
}
