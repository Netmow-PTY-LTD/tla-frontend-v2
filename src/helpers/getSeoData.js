export async function getSeoData(seoData, pageKey) {
  const slug = seoData.find(
    (item) => item.pageKey.toLowerCase() === pageKey
  )?.slug;
  // Convert pathname (e.g. /about or /contact) to slug (e.g. "about", "contact")
  //const slug = pathname.replace('/', '') || 'home';

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`,
      { cache: 'no-store' }
    );
    const data = await res.json();

    return data?.data || {};
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return {};
  }
}
