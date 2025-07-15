import { baseApi } from '../../baseApi/baseApi';

const optionApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        resetAppSettings: builder.mutation({
            query: (body) => ({
                url: '/admin/settings/reset',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['app-settings'],
        }),
        changeAppSettings: builder.mutation({
            query: (body) => ({
                url: '/admin/settings',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['app-settings'],
        }),
        getSettings: builder.query({
            query: () => ({
                url: '/admin/settings',
                method: 'GET',
            }),
            providesTags: ['app-settings'],
        }),

    }),
});

export const {
    useGetSettingsQuery,
    useChangeAppSettingsMutation,
    useResetAppSettingsMutation

} = optionApiService;
