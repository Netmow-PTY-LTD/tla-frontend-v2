import { baseApi } from '@/store/baseApi/baseApi';

const clientApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestLawyer: builder.mutation({
      query: (body) => ({
        url: '/lead-request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['lawyer-suggestion', 'requests', 'request'],
    }),
    getAllServiceWiseLawyersSuggestions: builder.query({
      query: ({ leadId, serviceId, page, limit, minRating }) => ({
        url: `lawyer-suggestions?leadId=${leadId}&serviceId=${serviceId}`,
        method: 'GET',
        params: {
          page: page,
          limit: limit,
          minRating,
        },
      }),

      providesTags: ['lawyer-suggestion'],
    }),

    getClientWiseCases: builder.query({
      query: (clientId) => ({
        url: `lead/list/${clientId}/client`,
        method: 'GET',
      }),
      providesTags: ['client-cases'],
    }),
  }),
});

export const {
  useRequestLawyerMutation,
  useGetAllServiceWiseLawyersSuggestionsQuery,
  useGetClientWiseCasesQuery,
} = clientApiService;
