import { baseApi } from '../../baseApi/baseApi';

const questionApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addQuestion: builder.mutation({
      query: (body) => ({
        url: '/question/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['question'],
    }),
    getAllQuestions: builder.query({
      query: () => ({
        url: '/question/list',
        method: 'GET',
      }),
      providesTags: ['question-list'],
    }),
    getSingleQuestion: builder.query({
      query: (id) => ({
        url: `/question/${id}`,
        method: 'GET',
      }),
      providesTags: ['question'],
    }),
    editQuestion: builder.mutation({
      query: (body) => ({
        url: `/question/edit/${body?.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['question','question-list'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/question/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['question','question-list'],
    }),
    updateQuestionOrder: builder.mutation({
      query: (body) => ({
        url: `/question/order`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['question','question-list'],
    }),
    addCountryWiseServiceQuestion: builder.mutation({
      query: (body) => ({
        url: '/country-wise-service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['question'],
    }),
    getServiceWiseQuestions: builder.query({
      query: ({ serviceId, countryId }) => ({
        url: `/service-wise-questions?serviceId=${serviceId}&countryId=${countryId}`,
        method: 'GET',
      }),
      providesTags: ['service-wise-question'],
    }),
  }),
});

export const {
  useAddQuestionMutation,
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  useEditQuestionMutation,
  useDeleteQuestionMutation,
  useAllCountryWiseServiceQuestionsQuery,
  useGetServiceWiseQuestionsQuery,
  useUpdateQuestionOrderMutation,
} = questionApiService;
