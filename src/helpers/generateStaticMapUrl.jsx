export function getStaticMapUrl(address) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const params = new URLSearchParams({
    center: address,
    zoom: '15',
    size: '625x235',
    maptype: 'roadmap',
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // exposed env var for frontend
  });

  return `${baseUrl}?${params.toString()}`;
}
