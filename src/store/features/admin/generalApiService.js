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
    getSingleRequest: builder.query({
      query: (id) => ({
        url: `/claims/${id}`,
        method: 'GET',
      }),
      providesTags: ['claims'],
    }),
    updateRequestStatus: builder.mutation({
      query: ({ claimId, status }) => ({
        url: `/claims/${claimId}/status`,
        method: 'PUT',
        body: { status },
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

export const {
  useGetClaimsRequestsQuery,
  useGetSingleRequestQuery,
  useUpdateRequestStatusMutation,
  useGetCompaniesListQuery,
} = generalApiService;
