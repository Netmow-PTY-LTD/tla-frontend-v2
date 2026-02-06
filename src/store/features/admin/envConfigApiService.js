import { baseApi } from '../../baseApi/baseApi';

const envConfigApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEnvConfigs: builder.query({
            query: () => ({
                url: '/env-config',
                method: 'GET',
            }),
            providesTags: ['env-config'],
        }),
        getEnvConfigByKey: builder.query({
            query: (key) => ({
                url: `/env-config/${key}`,
                method: 'GET',
            }),
            providesTags: (result, error, key) => [{ type: 'env-config', id: key }],
        }),
        updateEnvConfig: builder.mutation({
            query: ({ key, data }) => ({
                url: `/env-config/${key}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['env-config'],
        }),
        bulkUpdateEnvConfigs: builder.mutation({
            query: (data) => ({
                url: '/env-config/bulk/update',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['env-config'],
        }),
        syncFromEnv: builder.mutation({
            query: (data) => ({
                url: '/env-config/sync/from-env',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['env-config'],
        }),
        exportToEnv: builder.mutation({
            query: () => ({
                url: '/env-config/export/to-env',
                method: 'POST',
                responseHandler: (response) => response.blob(),
            }),
        }),
        reloadEnvConfigs: builder.mutation({
            query: () => ({
                url: '/env-config/reload',
                method: 'PUT',
            }),
            invalidatesTags: ['env-config'],
        }),
    }),
});

export const {
    useGetAllEnvConfigsQuery,
    useGetEnvConfigByKeyQuery,
    useLazyGetEnvConfigByKeyQuery,
    useUpdateEnvConfigMutation,
    useBulkUpdateEnvConfigsMutation,
    useSyncFromEnvMutation,
    useExportToEnvMutation,
    useReloadEnvConfigsMutation,
} = envConfigApiService;
