import { jwtDecode } from 'jwt-decode';

export const verifyToken = async (token) => {
  try {
    if (!token || typeof token !== 'string') return false;
    const decoded = jwtDecode(token);

    // ✅ Check token expiry — jwtDecode does NOT verify expiry by itself
    if (decoded?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.warn('⚠️ Token expired — treating as unauthenticated');
        return false;
      }
    }

    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return false;
  }
};
