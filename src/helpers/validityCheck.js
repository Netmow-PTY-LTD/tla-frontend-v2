import { jwtDecode } from 'jwt-decode';

export const checkValidity = (token) => {
  try {
    if (!token || typeof token !== 'string') return false;

    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('Token has expired');
      return false;
    }

    return true; // Just return boolean
  } catch (err) {
    console.error('Invalid token:', err);
    return false;
  }
};
