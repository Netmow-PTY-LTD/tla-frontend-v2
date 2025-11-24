export async function getSeoData(seoData, pageKey) {
  const slug = seoData.find(
    (item) => item.pageKey.toLowerCase() === pageKey.toLowerCase()
  )?.slug;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/seo/by-slug/${slug}`
    );
    const data = await res.json();

    return data?.data || {};
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return {};
  }
}
