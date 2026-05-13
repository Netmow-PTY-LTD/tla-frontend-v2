import { getSeoData } from '@/helpers/getSeoData';
import ContactPageComponent from './_components/ContactPageComponent';
import seoData from '@/data/seoData';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';

export async function generateMetadata() {
  const slug =
    seoData.find((item) => item.pageKey.toLowerCase() === 'contact')?.slug ||
    'contact';
  let seo = {};

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`
    );
    if (res.ok) {
      const seoMetadata = await res.json();
      seo = seoMetadata?.data || {};
    }
  } catch (error) {
    console.warn('Error fetching SEO metadata for Contact:', error.message);
  }

  const metaTitle = seo.metaTitle || 'About TheLawApp | Our Mission and Vision';
  const metaDescription =
    seo.metaDescription ||
    'Learn about TheLawApp — connecting clients and lawyers through a transparent legal marketplace.';
  const metaKeywords = seo.metaKeywords || ['about', 'TheLawApp', 'mission'];
  const metaImage =
    seo.metaImage ||
    'https://thelawapp.syd1.digitaloceanspaces.com/thelawapp/seo/metaimages/about.webp';

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
export default async function ContactPage() {
  const seo = await getSeoData(seoData, 'contact');
  const schema = await generateSchemaBySlug('contact', seo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactPageComponent />
    </>
  );
}
