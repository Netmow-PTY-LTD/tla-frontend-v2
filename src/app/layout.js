import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import ReduxProvider from '@/store/Provider';
// import { Toaster } from '@/components/ui/sonner';
import { SocketProvider } from '@/contexts/SocketContext';
import { Suspense } from 'react';
import Preloader from '@/components/Preloader';
import Script from 'next/script';
import { Toaster } from 'sonner';
import CookieGlobalInit from '@/components/CookieGlobalInit';
import seoData from '@/data/seoData.json';
import { generateSchemaBySlug } from '@/helpers/generateSchemaBySlug';
import { getSeoData } from '@/helpers/getSeoData';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

// export const metadata = {
//   title: 'Find a Lawyer | Hire a Lawyer | The Law App Online | The Law App',
//   description:
//     'The Law App is a complete online marketplace for people to search for lawyers at a price they can afford and for lawyers to build an online presence to find clients without the need for heavy marketing expenses. We match clients to lawyers directly based on their field of expertise and allow fair bidding to reach the right price.',
//   icons: {
//     icon: '/assets/img/favicon.ico',
//   },
// };

export async function generateMetadata() {
  const slug =
    seoData.find((item) => item.pageKey.toLowerCase() === 'home')?.slug ||
    'home';
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

export default async function RootLayout({ children }) {
  const seo = await getSeoData(seoData, 'home');
  const schema = await generateSchemaBySlug('home', seo);
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <CookieGlobalInit />
        <ReduxProvider>
          <Suspense fallback={<Preloader />}>
            <SocketProvider>
              <Toaster position="top-center" />
              {children}
            </SocketProvider>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
