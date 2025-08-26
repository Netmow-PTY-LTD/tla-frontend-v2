import { baseApi } from '../../baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({ page, limit, searchKeyword }) => ({
        url: '/lead/list',
        method: 'GET',
        params: { page, limit, searchKeyword },
      }),
      providesTags: ['lead-list'],
    }),
    getAllLeadsForAdmin: builder.query({
      query: (params) => ({
        url: '/lead/list/admin',
        method: 'GET',
        params
      }),
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
      query: ({ page, limit }) => ({
        url: '/lead/my',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['lead-my'],
    }),
    updateLead: builder.mutation({
      query: (data) => ({
        url: `/lead/edit/${data.id}`,
        method: 'PATCH',
        body: data?.data
      }),
      providesTags: ['lead', 'lead-list-admin', 'lead-list', 'lead-my'],
    }),
    contactLawyer: builder.mutation({
      query: (data) => ({
        url: '/contact-lawyer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['lead', 'response', 'notification', 'lead-list-admin', 'lead-list', 'response-my', 'response-list'],
    }),

    closeLead: builder.mutation({
      query: (data) => ({
        url: `/lead/${data.id}/close`,
        method: 'PATCH',
        body: data?.data
      }),
      providesTags: ['lead', 'lead-list-admin', 'lead-list', 'lead-my'],
    }),

    repostLead: builder.mutation({
      query: (data) => ({
        url: `/lead/repost`,
        method: 'POST',
        body:data
      }),
      providesTags: ['lead', 'lead-list-admin', 'lead-list', 'lead-my'],
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
  useRepostLeadMutation
} = leadsApiService;


