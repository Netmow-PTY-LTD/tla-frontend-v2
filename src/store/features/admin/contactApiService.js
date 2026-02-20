import { baseApi } from '../../baseApi/baseApi';

const contactApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getContactInfo: builder.query({
            query: () => ({
                url: '/contact/contact-info',
                method: 'GET',
            }),
            providesTags: ['contact-info'],
        }),
        upsertContactInfo: builder.mutation({
            query: (body) => ({
                url: '/contact/contact-info',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['contact-info'],
        }),
    }),
});

export const {
    useGetContactInfoQuery,
    useUpsertContactInfoMutation,
} = contactApiService;
