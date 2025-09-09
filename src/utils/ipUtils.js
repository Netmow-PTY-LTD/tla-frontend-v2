export function getClientIp(headers, socketRemoteAddress) {
  let ip = '';

  if (headers instanceof Headers) {
    ip =
      headers.get('x-forwarded-for') ||
      headers.get('x-real-ip') ||
      socketRemoteAddress ||
      '';
    return ip.split(',')[0].trim();
  }

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
  if (headers instanceof Headers) {
    return (
      headers.get('x-vercel-ip-country') ||
      headers.get('cf-ipcountry') ||
      headers.get('accept-language')?.split('-')[1]?.substring(0, 2) ||
      ''
    );
  }

  if (headers) {
    return (
      headers['x-vercel-ip-country'] ||
      headers['cf-ipcountry'] ||
      headers['accept-language']?.split('-')[1]?.substring(0, 2) ||
      ''
    );
  }

  return '';
}
