import { baseApi } from '@/store/baseApi/baseApi';

const leadsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (data) => ({
        url: '/lead/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['lead'],
    }),
    getAllLeadWiseResponses: builder.query({
      query: (id) => ({
        url: `/response/lead-wise/${id}`,
        method: 'GET',
      }),
      providesTags: ['response', 'lead'],
    }),
  }),
});

export const { useCreateLeadMutation, useGetAllLeadWiseResponsesQuery } =
  leadsApiService;
