import React from 'react';

const DynamicProfilePage = async ({ params }) => {
  const { slug } = await params;
  return (
    <div className="<h-full> flex flex-col items-center justify-center">
      <p className="text-xl font-semibold">{slug}</p>
      <h2>Dynamic Profile Page</h2>
      <p>This page is dynamically generated based on the slug.</p>
      {/* You can add more dynamic content here based on the slug */}
      <p>
        For example, if the slug is john-doe, you can fetch and display
        John&apos;s profile information here.
      </p>
      <p>Slug: {slug}</p>
    </div>
  );
};

export default DynamicProfilePage;
