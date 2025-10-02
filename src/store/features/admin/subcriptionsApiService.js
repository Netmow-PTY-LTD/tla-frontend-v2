import { baseApi } from '../../baseApi/baseApi';

const subscriptionsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubscription: builder.mutation({
      query: (body) => ({
        url: '/subscriptions/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['subscriptions'],
    }),
    getAllSubscriptions: builder.query({
      query: (params) => ({
        url: '/subscriptions/list',
        method: 'GET',
        params,
      }),
      providesTags: ['subscriptions'],
    }),
    getSubscriptionById: builder.query({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}`,
        method: 'GET',
      }),
      providesTags: ['subscriptions'],
    }),
    updateSubscription: builder.mutation({
      query: ({ subscriptionId, body }) => ({
        url: `/subscriptions/${subscriptionId}/update`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['subscriptions'],
    }),
    deleteSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subscriptions'],
    }),
  }),
});

export const {
  useAddSubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionsApiService;
