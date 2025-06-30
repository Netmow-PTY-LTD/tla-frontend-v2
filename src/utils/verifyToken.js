import { jwtDecode } from 'jwt-decode';
export const verifyToken = async (token) => {
  const decode = jwtDecode(token);
  return decode;
};
