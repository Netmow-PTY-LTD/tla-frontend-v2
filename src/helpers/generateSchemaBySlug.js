export async function generateSchemaBySlug(slug, seo = {}) {
  const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}`;
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/settings`
  );

  const setting = await result.json();
  const logo = setting?.data?.appLogo || `/assets/img/logo.png`;

  const organization = {
    '@type': 'Organization',
    name: 'TheLawApp',
    legalName: 'The Law App',
    url: siteUrl,
    logo,
    sameAs: [
      'https://www.facebook.com/thelawapp',
      'https://www.linkedin.com/company/thelawapp',
      'https://twitter.com/thelawapp',
      'https://www.instagram.com/thelawapp',
    ],
  };

  // ✅ Default fallback (same as before)
  switch (slug) {
    case 'about':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'AboutPage',
            name: seo.metaTitle,
            url: `${siteUrl}/about`,
            description: seo.metaDescription,
            publisher: organization,
          },
        ],
      };
    case 'contact':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'ContactPage',
            name: 'Contact TheLawApp',
            url: `${siteUrl}/contact`,
            description: seo.metaDescription,
            publisher: organization,
          },
        ],
      };

    case 'pricing':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebPage',
            name: 'Pricing – TheLawApp',
            url: `${siteUrl}/pricing`,
            description:
              seo.metaDescription ||
              'View pricing plans and options for TheLawApp.',
            publisher: organization,
            mainEntity: {
              '@type': 'OfferCatalog',
              name: 'TheLawApp Pricing Plans',
              url: `${siteUrl}/pricing`,
              itemListElement: [
                {
                  '@type': 'Offer',
                  name: 'Basic Plan',
                  priceCurrency: 'USD',
                  price: '0',
                  description: 'Free plan for individuals starting out.',
                },
                {
                  '@type': 'Offer',
                  name: 'Pro Plan',
                  priceCurrency: 'USD',
                  price: '49.99',
                  description: 'Advanced features for professionals.',
                },
              ],
            },
          },
        ],
      };

    case 'how-it-works':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebPage',
            name: 'How It Works – TheLawApp',
            url: `${siteUrl}/how-it-works`,
            description:
              seo.metaDescription ||
              'Learn how TheLawApp works and how to get started.',
            publisher: organization,
            mainEntity: {
              '@type': 'HowTo',
              name: 'How to Use TheLawApp',
              step: [
                {
                  '@type': 'HowToStep',
                  name: 'Sign Up',
                  text: 'Create your free account on TheLawApp.',
                },
                {
                  '@type': 'HowToStep',
                  name: 'Connect with Lawyers',
                  text: 'Find and chat with qualified legal professionals.',
                },
                {
                  '@type': 'HowToStep',
                  name: 'Get Legal Help',
                  text: 'Receive personalized legal assistance and manage your cases easily.',
                },
              ],
            },
          },
        ],
      };

    case 'login':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebPage',
            name: seo.metaTitle,
            url: `${siteUrl}/${slug}`,
            description: seo.metaDescription,
            publisher: organization,
          },
        ],
      };

    case 'register':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebPage',
            name: seo.metaTitle,
            url: `${siteUrl}/${slug}`,
            description: seo.metaDescription,
            publisher: organization,
          },
        ],
      };

    case 'blog':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebPage',
            name: seo.metaTitle,
            url: `${siteUrl}/${slug}`,
            description: seo.metaDescription,
            publisher: organization,
          },
        ],
      };

    case 'blogPost':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'BlogPosting',
            headline: seo?.seo?.metaTitle,
            description: seo?.seo?.metaDescription,
            image: [seo?.seo?.metaImage],
            author: {
              '@type': 'Person',
              name: 'TheLawApp Online',
            },
            publisher: organization,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteUrl}/blog/${seo?.slug}`,
            },
            datePublished:
              seo?.publishedAt || seo?.createdAt || new Date().toISOString(),
            dateModified: seo?.updatedAt || new Date().toISOString(),
            url: `${siteUrl}/blog/${seo?.slug}`,
          },
        ],
      };

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebPage',
            name: seo.metaTitle,
            url: `${siteUrl}/${slug}`,
            description: seo.metaDescription,
            publisher: organization,
          },
        ],
      };
    case 'home':
    default:
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organization,
          {
            '@type': 'WebSite',
            name: 'TheLawApp',
            url: siteUrl,
          },
        ],
      };
  }
}
