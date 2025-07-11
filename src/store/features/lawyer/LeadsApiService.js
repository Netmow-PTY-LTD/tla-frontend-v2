import { baseApi } from '../../baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({ page, limit }) => ({
        url: '/lead/list',
        method: 'GET',
        params: { page, limit },
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
    contactLawyer: builder.mutation({
      query: (data) => ({
        url: '/contact-lawyer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['lead','response'],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
  useGetAllMyLeadsQuery,
  useContactLawyerMutation,
} = leadsApiService;
