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
  }),
});

export const { useCreateLeadMutation } = leadsApiService;
