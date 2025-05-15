import { baseApi } from '../../baseApi/baseApi';

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
    getCountryList: builder.query({
      query: () => ({
        url: `/country/list`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetServiceBySlugQuery,
  useGetCountryListQuery,
} = publicApiService;
