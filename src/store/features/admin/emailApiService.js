import { baseApi } from '../../baseApi/baseApi';

const emailApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addEmailTemplate: builder.mutation({
            query: (body) => ({
                url: '/admin/email-campaigns',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['email-campaigns'],
        }),
        getAllEmails: builder.query({
            query: (params) => ({
                url: '/admin/email-campaigns',
                method: 'GET',
                params,
            }),
            providesTags: ['email-campaigns'],
        }),
        getSingleEmail: builder.query({
            query: (id) => ({
                url: `/admin/email-campaigns/${id}`,
                method: 'GET',
            }),
            providesTags: ['email-campaigns'],
        }),
        updateEmailTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/email-campaigns/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['email-campaigns'],
        }),
        deleteEmail: builder.mutation({
            query: (id) => ({
                url: `/admin/email-campaigns/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['email-campaigns'],
        }),
    }),
});

export const {
    useAddEmailTemplateMutation,
    useGetAllEmailsQuery,
    useGetSingleEmailQuery,
    useUpdateEmailTemplateMutation,
    useDeleteEmailMutation,
} = emailApiService;
