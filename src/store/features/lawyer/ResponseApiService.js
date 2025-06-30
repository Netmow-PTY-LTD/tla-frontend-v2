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
  }),
});

export const {
  useCreateResponseMutation,
  useGetAllResponsesQuery,
  useGetSingleResponseQuery,
  useGetAllMyResponsesQuery,
} = responseApiService;
