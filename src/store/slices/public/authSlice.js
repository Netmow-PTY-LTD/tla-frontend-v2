import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const authSlice = createApi({
  reducerPath: 'authSlice',
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${process.env.NEXT_PUBLIC_BASE_URL_PROD}` +
      `${process.env.NEXT_PUBLIC_API_VERSION_PROD}` +
      '/public',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    authLogin: builder.mutation({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useAuthLoginMutation } = authSlice;
