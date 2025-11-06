import PricingPageComponent from './components/PricingPageComponent';
import seoData from '@/data/seoData.json';
export async function generateMetadata() {
  const slug =
    seoData.find((item) => item.pageKey.toLowerCase() === 'pricing')?.slug ||
    'pricing';
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`
  );
  const seoMetadata = await res.json();
  const seo = seoMetadata?.data || {};

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
    icons: {
      icon: '/assets/img/favicon.ico',
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

const PricingPage = () => {
  return <PricingPageComponent />;
};

export default PricingPage;
