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
  }),
});

export const { useGetClaimsRequestsQuery } = generalApiService;
