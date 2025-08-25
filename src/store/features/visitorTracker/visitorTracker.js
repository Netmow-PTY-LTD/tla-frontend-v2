import { baseApi } from '../../baseApi/baseApi';

const visitorTrackerApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecentVisitor: builder.query({
            query: (params) => ({
                url: '/visitor-tracker/recent',
                method: 'GET',
                params,
            }),
            providesTags: ['recent-visitor'],
        }),

        visitProfile: builder.mutation({
            query: (data) => ({
                url: `/visitor-tracker/visit`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['recent-visitor']
        }),



    }),
});

export const {
    useVisitProfileMutation,
    useGetRecentVisitorQuery
} = visitorTrackerApiService;
