import React from 'react';
import BlogPostDetails from '../_components/BlogDetails';

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  return (
    <>
      <BlogPostDetails slug={slug} />
    </>
  );
}
