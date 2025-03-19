import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const publicServicesSlice = createApi({
  reducerPath: 'publicServicesSlice',
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
    getAllServices: builder.query({
      query: () => ({
        url: '/services',
        method: 'GET',
      }),
    }),
    getServiceBySlug: builder.query({
      query: (slug) => ({
        url: '/services/${slug}',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllServicesQuery, useGetServiceBySlugQuery } =
  publicServicesSlice;
