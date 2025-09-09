export function getClientIp(headers, socketRemoteAddress) {
  let ip = '';

  // App Router (Headers object)
  if (headers instanceof Headers) {
    ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || '';
    if (ip) return ip.split(',')[0].trim();
    return socketRemoteAddress || '';
  }

  // Pages Router (plain object)
  if (headers) {
    ip =
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      headers['x-real-ip'] ||
      socketRemoteAddress ||
      '';
  }

  return ip.replace(/^::ffff:/, '').trim();
}

export function getCountry(headers) {
  let country = '';

  if (headers instanceof Headers) {
    country =
      headers.get('cf-ipcountry') || headers.get('x-vercel-ip-country') || '';
    if (country) return country;
    return headers.get('accept-language')?.split('-')[1]?.substring(0, 2) || '';
  }

  if (headers) {
    country = headers['cf-ipcountry'] || headers['x-vercel-ip-country'] || '';
    if (country) return country;
    return headers['accept-language']?.split('-')[1]?.substring(0, 2) || '';
  }

  return '';
}
