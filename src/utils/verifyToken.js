import { jwtDecode } from 'jwt-decode';

export const verifyToken = async (token) => {
  try {
    if (!token || typeof token !== 'string') return false;
    const decoded = jwtDecode(token);
    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return false;
  }
};
