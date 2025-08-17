import { baseApi } from '@/store/baseApi/baseApi';

const clientApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestLawyer: builder.mutation({
      query: (body) => ({
        url: '/lead-request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['request'],
    }),
    getAllServiceWiseLawyersSuggestions: builder.query({
      query: ({ leadId, serviceId, page, limit }) => ({
        url: `lawyer-suggestions?leadId=${leadId}&serviceId=${serviceId}`,
        method: 'GET',
        params: {
          page: page,
          limit: limit,
        },
      }),

      providesTags: ['request'],
    }),
  }),
});

export const {
  useRequestLawyerMutation,
  useGetAllServiceWiseLawyersSuggestionsQuery,
} = clientApiService;
