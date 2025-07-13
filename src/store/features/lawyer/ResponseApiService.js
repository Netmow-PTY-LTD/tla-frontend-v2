import { baseApi } from '../../baseApi/baseApi';

const responseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createResponse: builder.mutation({
      query: (data) => ({
        url: '/response/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['response'],
    }),

    getAllResponses: builder.query({
      query: () => ({
        url: '/response/list',
        method: 'GET',
      }),
      providesTags: ['response'],
    }),

    getSingleResponse: builder.query({
      query: (id) => ({
        url: `/response/${id}`,
        method: 'GET',
      }),
      providesTags: ['response'],
    }),
    getAllMyResponses: builder.query({
      query: () => ({
        url: '/response/my',
        method: 'GET',
      }),
      providesTags: ['response'],
    }),

    updateResponseStatus: builder.mutation({
      query: (body) => {
        console.log('body ==>', body)

        return {
          url: `/response/${body.responseId}/status`,
          method: 'PATCH',
          body: body.data,
        }
      },
      invalidatesTags: ['response'],
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
      invalidatesTags: ['response','notification'],
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
  useContactLeadMutation
  


} = responseApiService;
