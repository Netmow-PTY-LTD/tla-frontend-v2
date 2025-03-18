import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const servicesSlice = createApi({
  reducerPath: 'servicesSlice',
  baseQuery: fetchBaseQuery({
    baseUrl:
      `${process.env.NEXT_PUBLIC_BASE_URL_PROD}` +
      `${process.env.NEXT_PUBLIC_API_VERSION_PROD}` +
      '/super',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (body) => ({
        url: '/service',
        method: 'POST',
        body,
      }),
    }),
    allServices: builder.query({
      query: () => ({
        url: '/service',
        method: 'GET',
      }),
    }),
  }),
});

export const { useAddServiceMutation, useAllServicesQuery } = servicesSlice;
