import React from 'react';
import LoginForm from '@/components/auth/login/LoginForm';
import seoData from '@/data/seoData';
import { getSeoData } from '@/helpers/getSeoData';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';

export async function generateMetadata() {
  const slug = seoData.find(
    (item) => item.pageKey.toLowerCase() === 'login'
  )?.slug;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`
  );
  const seoMetadata = await res.json();
  const seo = seoMetadata?.data || {};

  const metaTitle = seo.metaTitle || 'Login | TheLawApp';
  const metaDescription =
    seo.metaDescription ||
    'Learn about TheLawApp — connecting clients and lawyers through a transparent legal marketplace.';
  const metaKeywords = seo.metaKeywords || ['login', 'TheLawApp'];
  const metaImage =
    seo.metaImage ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/about.webp';

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/settings`
  );

  const setting = await result.json();
  const favicon = setting?.data?.favicon || '/assets/img/favicon.ico';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    icons: {
      icon: favicon,
    },
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

export default async function Login() {
  const seo = await getSeoData(seoData, 'login');
  const schema = await generateSchemaBySlug('login', seo);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <section
        className="tla-auth-section flex justify-center items-center py-8"
        // style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
      >
        <div className="tla-auth-box max-w-[900px] w-full mx-auto">
          <div className="flex flex-wrap w-full">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-[20px] md:p-[38px] relative">
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[150px] h-[150px] rounded-full bg-[#00C3C080] blur-[70px]"></div>
              </div>
              <LoginForm />
            </div>
            {/* Image Section (Hidden on mobile) */}
            <div
              className="hidden md:block w-full md:w-1/2"
              style={{
                backgroundImage: `url('/assets/img/login-image.webp')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                borderRadius: '0 14px 14px 0',
              }}
            >
              <div className="tla-auth-image">
                {/* <Image
                  src="/assets/img/login-img.png"
                  width={215}
                  height={373}
                  alt="Auth Image"
                /> */}
                <div className="tla-auth-login-text">{`Log in to access freelance legal opportunities, manage cases, and grow your independent practice.`}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
