import { jwtDecode } from 'jwt-decode';

export const checkValidity = (token) => {
  try {
    if (!token || typeof token !== 'string') return false;

    const decoded = jwtDecode(token);

    // Check if the token has expired
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('Token has expired');
      return false;
    }

    return decoded; // token is valid
  } catch (err) {
    console.error('Invalid token:', err);
    return false;
  }
};
