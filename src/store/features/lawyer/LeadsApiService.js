import { baseApi } from '../../baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: () => ({
        url: '/lead/list',
        method: 'GET',
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
      query: () => ({
        url: '/lead/my',
        method: 'GET',
      }),
      providesTags: ['lead'],
    }),
    contactLawyer: builder.mutation({
      query: (data) => ({
        url: '/contact-lawyer',
        method: 'POST',
        body:data
        
      }),
      providesTags: ['lead'],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetSingleLeadQuery,
  useGetAllMyLeadsQuery,
  useContactLawyerMutation
} = leadsApiService;
