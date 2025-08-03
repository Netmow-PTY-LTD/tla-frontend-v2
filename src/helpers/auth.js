import { verifyToken } from '@/utils/verifyToken';
import Cookies from 'js-cookie';

export async function getUserFromToken() {
  const token = Cookies.get('token');

  if (!token) return null;

  const user = await verifyToken(token);
  return user;
}
