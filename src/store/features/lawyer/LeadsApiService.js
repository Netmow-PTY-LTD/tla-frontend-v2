import { baseApi } from '../../baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({ page, limit, searchKeyword }) => ({
        url: '/lead/list',
        method: 'GET',
        params: { page, limit, searchKeyword },
      }),
      providesTags: ['lead'],
    }),
    getAllLeadsForAdmin: builder.query({
      query: (params) => ({
        url: '/lead/list/admin',
        method: 'GET',
        params
      }),
      providesTags: ['lead'],
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
      providesTags: ['lead'],
    }),
    updateLead: builder.mutation({
      query: (data) => ({
        url: `/lead/edit/${data.id}`,
        method: 'PATCH',
        body: data?.data
      }),
      providesTags: ['lead'],
    }),
    contactLawyer: builder.mutation({
      query: (data) => ({
        url: '/contact-lawyer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['lead', 'response', 'notification'],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
  useGetAllMyLeadsQuery,
  useContactLawyerMutation,
  useUpdateLeadMutation,
  useGetAllLeadsForAdminQuery
} = leadsApiService;


