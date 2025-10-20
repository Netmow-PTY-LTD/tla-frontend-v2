import { baseApi } from '../../baseApi/baseApi';

const generalApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClaimsRequests: builder.query({
      query: (params) => ({
        url: `/claims/list`,
        method: 'GET',
        params,
      }),
      providesTags: ['claims'],
    }),
    getCompaniesList: builder.query({
      query: (params) => ({
        url: `/firms/list`,
        method: 'GET',
        params,
      }),
      providesTags: ['companies'],
    }),
  }),
});

export const { useGetClaimsRequestsQuery, useGetCompaniesListQuery } =
  generalApiService;
