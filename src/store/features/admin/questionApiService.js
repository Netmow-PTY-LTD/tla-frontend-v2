import { baseApi } from '../../baseApi/baseApi';

const questionApiQuestion = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addQuestion: builder.mutation({
      query: (body) => ({
        url: '/question/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['question'],
    }),
    allQuestions: builder.query({
      query: () => ({
        url: '/question/list',
        method: 'GET',
      }),
      providesTags: ['question'],
    }),
    singleQuestion: builder.query({
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
      invalidatesTags: ['question'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/question/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['question'],
    }),
     addCountryWiseServiceQuestion: builder.mutation({
      query: (body) => ({
        url: '/country-wise-service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['question'],
    }),
  }),
});

export const {
  useAddQuestionMutation,
  useAllQuestionsQuery,
  useSingleQuestionQuery,
  useEditQuestionMutation,
  useDeleteQuestionMutation,
  useAllCountryWiseServiceQuestionsQuery,
} = questionApiQuestion;
