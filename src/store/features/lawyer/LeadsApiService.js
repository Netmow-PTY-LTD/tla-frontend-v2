import { baseApi } from '../../baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: (arg) => {
        if (arg) {
          const { page, limit, searchKeyword } = arg;
          return {
            url: '/lead/list',
            method: 'GET',
            params: { page, limit, searchKeyword },
          };
        }
        return {
          url: '/lead/list',
          method: 'GET',
        };
      },
      providesTags: ['lead-list'],
    }),
    getAllLeadsForAdmin: builder.query({
      query: (params) => {
        if (params) {
          return {
            url: '/lead/list/admin',
            method: 'GET',
            params,
          };
        }
        return {
          url: '/lead/list/admin',
          method: 'GET',
        };
      },
      providesTags: ['lead-list-admin'],
    }),
    getSingleLead: builder.query({
      query: (id) => ({
        url: `/lead/${id}`,
        method: 'GET',
      }),
      providesTags: ['lead'],
    }),
    getAllMyLeads: builder.query({
      query: (arg) => {
        if (arg) {
          const { page, limit } = arg;
          return {
            url: '/lead/my',
            method: 'GET',
            params: { page, limit },
          };
        }
        return {
          url: '/lead/my',
          method: 'GET',
        };
      },
      providesTags: ['lead-my'],
    }),
    updateLead: builder.mutation({
      query: (data) => ({
        url: `/lead/edit/${data.id}`,
        method: 'PATCH',
        body: data?.data,
      }),
      providesTags: ['lead', 'lead-list-admin', 'lead-list', 'lead-my'],
    }),
    contactLawyer: builder.mutation({
      query: (data) => ({
        url: '/contact-lawyer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'lead',
        'response',
        'notification',
        'lead-list-admin',
        'lead-list',
        'response-my',
        'response-list',
      ],
    }),

    closeLead: builder.mutation({
      query: (data) => ({
        url: `/lead/${data.id}/close`,
        method: 'PATCH',
        body: data?.data,
      }),
      providesTags: ['lead', 'lead-list-admin', 'lead-list', 'lead-my'],
    }),

    repostLead: builder.mutation({
      query: (data) => ({
        url: `/lead/repost`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['lead', 'lead-list-admin', 'lead-list', 'lead-my'],
    }),

    //   cancel Lawyer membership request from Firm

    cancelLawyerMembershipRequest: builder.mutation({
      query: (data) => ({
        url: `/lawyer/cancel-membership-request`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['userInfo'],
    }),
    cancelLawyerMembership: builder.mutation({
      query: (data) => ({
        url: `/lawyer/cancel-membership`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['userInfo'],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
  useGetAllMyLeadsQuery,
  useContactLawyerMutation,
  useUpdateLeadMutation,
  useGetAllLeadsForAdminQuery,
  useCloseLeadMutation,
  useRepostLeadMutation,
  useCancelLawyerMembershipRequestMutation,
  useCancelLawyerMembershipMutation,
} = leadsApiService;
