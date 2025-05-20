import { baseApi } from '../../baseApi/baseApi';

const optionApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addOption: builder.mutation({
      query: (body) => ({
        url: '/option/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['option'],
    }),
    getAllOptions: builder.query({
      query: () => ({
        url: '/option/list',
        method: 'GET',
      }),
      providesTags: ['option'],
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
      invalidatesTags: ['option'],
    }),
    deleteOption: builder.mutation({
      query: (id) => ({
        url: `/option/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['option'],
    }),
  }),
});

export const {
  useAddOptionMutation,
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  useEditQuestionMutation,
  useDeleteQuestionMutation,
  useAllCountryWiseServiceQuestionsQuery,
  useGetServiceWiseQuestionsQuery
} = optionApiService;
