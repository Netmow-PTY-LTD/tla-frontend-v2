import RegisterMain from '@/components/auth/RegisterMain';
import { getSeoData } from '@/helpers/getSeoData';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import seoData from '@/data/seoData';

export async function generateMetadata() {
  const slug = seoData.find(
    (item) => item.pageKey.toLowerCase() === 'register'
  )?.slug;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`,
    { cache: 'no-store' }
  );
  const seoMetadata = await res.json();
  const seo = seoMetadata?.data || {};

  const metaTitle = seo.metaTitle || 'Register | TheLawApp';
  const metaDescription =
    seo.metaDescription ||
    'Join TheLawApp and connect with clients in a transparent legal marketplace.';
  const metaKeywords = seo.metaKeywords || ['register', 'TheLawApp'];
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

export default async function Register() {
  const seo = await getSeoData(seoData, 'register');
  const schema = await generateSchemaBySlug('register', seo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <RegisterMain />
    </>
  );
}
