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

  const title = post?.seo?.metaTitle || 'Blog Post | TheLawApp';
  const description =
    post?.seo?.metaDescription ||
    'Read the latest legal insights and updates from TheLawApp.';
  const image =
    post.seo?.metaImage ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/blog.webp';
  const keywords = post?.seo?.keywords || ['law', 'legal', 'TheLawApp'];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
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
  // Generate schema for this post
  //const seo = await getSeoData(seoData, 'blog');
  const schema = await generateSchemaBySlug('blogPost', post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <>
        <BlogPostDetails slug={slug} />
      </>
    </>
  );
}
