import { jwtDecode } from 'jwt-decode';
export const verifyToken = (token) => {
  const decode = jwtDecode(token);
  return decode;
};
