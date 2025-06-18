import { baseApi } from '../../baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: () => ({
        url: '/lead/list',
        method: 'GET',
      }),
      invalidatesTags: ['lead'],
    }),
    getSingleLead: builder.query({
      query: (id) => ({
        url: `/lead/${id}`,
        method: 'GET',
      }),
      providesTags: ['lead'],
    }),
  }),
});

export const { useGetAllLeadsQuery, useGetSingleLeadQuery } = leadsApiService;
