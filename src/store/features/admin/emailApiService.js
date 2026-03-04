import { baseApi } from '../../baseApi/baseApi';

const emailApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Templates & Utilities
        getTemplates: builder.query({
            query: () => ({
                url: '/admin/email-campaigns/templates',
                method: 'GET',
            }),
        }),
        getSegments: builder.query({
            query: () => ({
                url: '/admin/email-campaigns/segments',
                method: 'GET',
            }),
        }),
        sendPreview: builder.mutation({
            query: (body) => ({
                url: '/admin/email-campaigns/preview',
                method: 'POST',
                body,
            }),
        }),

        // CRUD
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

        // Actions
        sendCampaignNow: builder.mutation({
            query: (id) => ({
                url: `/admin/email-campaigns/${id}/send-now`,
                method: 'POST',
            }),
            invalidatesTags: ['email-campaigns'],
        }),
        getCampaignLog: builder.query({
            query: ({ id, params }) => ({
                url: `/admin/email-campaigns/${id}/log`,
                method: 'GET',
                params,
            }),
        }),
        getCampaignStats: builder.query({
            query: (id) => ({
                url: `/admin/email-campaigns/${id}/stats`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation,
    useAddEmailTemplateMutation,
    useGetAllEmailsQuery,
    useGetSingleEmailQuery,
    useUpdateEmailTemplateMutation,
    useDeleteEmailMutation,
    useSendCampaignNowMutation,
    useGetCampaignLogQuery,
    useGetCampaignStatsQuery,
} = emailApiService;
