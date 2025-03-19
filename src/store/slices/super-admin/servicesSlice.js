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
      // onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
      //   try {
      //     await queryFulfilled;

      //     dispatch(servicesSlice.endpoints.allServices.initiate());
      //   } catch (error) {
      //     console.error('Failed to add service:', error);
      //   }
      // },
    }),
    allServices: builder.query({
      query: () => ({
        url: '/service',
        method: 'GET',
      }),
    }),
    singleServices: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: 'GET',
      }),
    }),
    editServices: builder.mutation({
      query: (body) => ({
        url: `/service/${body.get('service_id')}`,
        method: 'PATCH',
        body,
      }),
    }),
    changeServicesStatus: builder.mutation({
      query: (body) => ({
        url: `/service/${body.id}/status`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useAddServiceMutation,
  useAllServicesQuery,
  useSingleServicesQuery,
  useEditServicesMutation,
  useChangeServicesStatusMutation,
} = servicesSlice;
