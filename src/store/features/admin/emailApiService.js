import { baseApi } from '../../baseApi/baseApi';

const emailApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Email Templates CRUD (api/v1/email-templates)
        getAllEmailTemplates: builder.query({
            query: (params) => ({
                url: '/email-templates',
                method: 'GET',
                params,
            }),
            providesTags: ['email-templates'],
        }),
        getSingleEmailTemplate: builder.query({
            query: (id) => ({
                url: `/email-templates/${id}`,
                method: 'GET',
            }),
            providesTags: ['email-templates'],
        }),
        getEmailTemplateByKey: builder.query({
            query: (key) => ({
                url: `/email-templates/template-key/${key}`,
                method: 'GET',
            }),
            providesTags: ['email-templates'],
        }),
        getEmailTemplateConstants: builder.query({
            query: () => ({
                url: '/email-templates/constants',
                method: 'GET',
            }),
        }),
        addEmailTemplate: builder.mutation({
            query: (body) => ({
                url: '/email-templates',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['email-templates'],
        }),
        updateEmailTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/email-templates/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['email-templates'],
        }),
        deleteEmailTemplate: builder.mutation({
            query: (id) => ({
                url: `/email-templates/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['email-templates'],
        }),

        // Email Campaigns CRUD (api/v1/admin/email-campaigns) - Legacy/Continued
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
        // ... other campaign endpoints if needed, but keeping it clean for the user's request
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
        deleteEmail: builder.mutation({
            query: (id) => ({
                url: `/admin/email-campaigns/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['email-campaigns'],
        }),

        // Utilities for Campaigns
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
    }),
});

export const {
    // Template Hooks
    useGetAllEmailTemplatesQuery,
    useGetSingleEmailTemplateQuery,
    useGetEmailTemplateByKeyQuery,
    useGetEmailTemplateConstantsQuery,
    useAddEmailTemplateMutation,
    useUpdateEmailTemplateMutation,
    useDeleteEmailTemplateMutation,

    // Campaign Hooks
    useGetAllEmailsQuery,
    useGetSingleEmailQuery,
    useSendCampaignNowMutation,
    useGetCampaignLogQuery,
    useGetCampaignStatsQuery,
    useDeleteEmailMutation,
    useGetTemplatesQuery,
    useGetSegmentsQuery,
    useSendPreviewMutation,
} = emailApiService;
