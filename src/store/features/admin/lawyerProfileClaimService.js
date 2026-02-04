import { baseApi } from '../../baseApi/baseApi';

const lawyerProfileClaimService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitLawyerProfileClaim: builder.mutation({
      query: (body) => ({
        url: '/lawyer-profile-claims',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['lawyer-profile-claims'],
    }),
    getLawyerProfileClaims: builder.query({
      query: (params) => ({
        url: '/lawyer-profile-claims',
        method: 'GET',
        params,
      }),
      providesTags: ['lawyer-profile-claims'],
    }),
    getSingleLawyerProfileClaim: builder.query({
      query: (id) => ({
        url: `/lawyer-profile-claims/${id}`,
        method: 'GET',
      }),
      providesTags: ['lawyer-profile-claims'],
    }),
    updateLawyerProfileClaimStatus: builder.mutation({
      query: ({ id, status, reviewerNote }) => ({
        url: `/lawyer-profile-claims/${id}/status`,
        method: 'PATCH',
        body: { status, reviewerNote },
      }),
      invalidatesTags: ['lawyer-profile-claims'],
    }),
  }),
});

export const {
  useSubmitLawyerProfileClaimMutation,
  useGetLawyerProfileClaimsQuery,
  useGetSingleLawyerProfileClaimQuery,
  useUpdateLawyerProfileClaimStatusMutation,
} = lawyerProfileClaimService;
