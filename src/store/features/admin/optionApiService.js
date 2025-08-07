import { baseApi } from '../../baseApi/baseApi';

const optionApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addOption: builder.mutation({
      query: (body) => ({
        url: '/option/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['option','option-list'],
    }),
    getAllOptions: builder.query({
      query: () => ({
        url: '/option/list',
        method: 'GET',
      }),
      providesTags: ['option-list'],
    }),
    getSingleOption: builder.query({
      query: (id) => ({
        url: `/option/${id}`,
        method: 'GET',
      }),
      providesTags: ['option'],
    }),
    editOption: builder.mutation({
      query: (body) => ({
        url: `/option/edit/${body?.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['option','option-list'],
    }),
    deleteOption: builder.mutation({
      query: (id) => ({
        url: `/option/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['option','option-list'],
    }),
    getQuestionWiseOptions: builder.query({
      query: (questionId) => ({
        url: `/question-wise-options?questionId=${questionId}`,
        method: 'GET',
      }),
      providesTags: ['question-wise-option'],
    }),
  }),
});

export const {
  useAddOptionMutation,
  useGetAllOptionsQuery,
  useGetSingleOptionQuery,
  useEditOptionMutation,
  useDeleteOptionMutation,
  useGetQuestionWiseOptionsQuery,
} = optionApiService;
