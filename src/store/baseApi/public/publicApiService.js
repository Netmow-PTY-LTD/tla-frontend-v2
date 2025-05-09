import { baseApi } from '../baseApi';

const publicApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => ({
        url: '/services',
        method: 'GET',
      }),
    }),
    getServiceBySlug: builder.query({
      query: (slug) => ({
        url: `/services/${slug}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllServicesQuery, useGetServiceBySlugQuery } =
  publicApiService;
