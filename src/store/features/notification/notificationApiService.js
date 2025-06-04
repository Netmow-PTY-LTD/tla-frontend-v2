import { baseApi } from '../../baseApi/baseApi';

const notificationApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateEmailNotification: builder.mutation({
      query: (body) => ({
        url: '/settings/notification/email',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['notification'],
    }),
    updateBrowserNotification: builder.mutation({
      query: (body) => ({
        url: '/settings/notification/browser',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['notification'],
    }),
    getAllNotifications: builder.query({
      query: () => ({
        url: `/settings/notification`,
        method: 'GET',
      }),
      providesTags: ['notification'],
    }),
  }),
});

export const {
  useUpdateEmailNotificationMutation,
  useUpdateBrowserNotificationMutation,
  useGetAllNotificationsQuery,
} = notificationApiService;
