import { baseApi } from '../../baseApi/baseApi';

export const responseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createResponse: builder.mutation({
      query: (data) => ({
        url: '/response/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags:['response','response-my','response-list'],
    }),

    getAllResponses: builder.query({
      query: () => ({
        url: '/response/list',
        method: 'GET',
      }),
      providesTags: ['response-list'],
    }),

    getSingleResponse: builder.query({
      query: (id) => ({
        url: `/response/${id}`,
        method: 'GET',
      }),
      providesTags: ['response'],
    }),
    getAllMyResponses: builder.query({
      query: (queryParams) => ({
        url: '/response/my',
        method: 'GET',
        params:queryParams
      }),
      providesTags: ['response-my'],
    }),

    updateResponseStatus: builder.mutation({
      query: (body) => {
        return {
          url: `/response/${body.responseId}/status`,
          method: 'PATCH',
          body: body.data,
        }
      },
      invalidatesTags: ['response','notification','response-my','response-list'],
    }),

    // activity log
    activityLog: builder.mutation({
      query: (body) => ({
        url: `/activity-log`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['response'],
    }),
    contactLead: builder.mutation({
      query: (body) => {
        return {
          url: '/contact/contact-lead',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: ['response','notification','response-my','response-list','credit-payment','user-credit-stats','transaction-history','transaction-history-list','next-offer'],
    }),
  getChatHistory: builder.query({
      query: (responseId) => ({
        url: `/chat/${responseId}`,
        method: 'GET',
       
      }),
      // providesTags: ['chat'],
    }),

  }),
});

export const {
  useCreateResponseMutation,
  useGetAllResponsesQuery,
  useGetSingleResponseQuery,
  useGetAllMyResponsesQuery,
  useUpdateResponseStatusMutation,
  useActivityLogMutation,
  useContactLeadMutation,
  useGetChatHistoryQuery
  


} = responseApiService;
