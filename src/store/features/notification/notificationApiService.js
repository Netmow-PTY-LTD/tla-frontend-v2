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
      invalidatesTags: ['notificationPreferences'],
    }),
    getAllNotifications: builder.query({
      query: () => ({
        url: `/settings/notification`,
        method: 'GET',
      }),
      providesTags: ['notificationPreferences'],
    }),
    getAllNotificationsPreferences: builder.query({
      query: () => ({
        url: `/settings/notification/preferences`,
        method: 'GET',
      }),
      providesTags: ['notification'],
    }),
     markAsRedNotification: builder.mutation({
      query: (body) => ({
        url: `/settings/notification/${body.notificationId}/red`,
        method: 'PUT',
        body:body.data,
      }),
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useUpdateEmailNotificationMutation,
  useUpdateBrowserNotificationMutation,
  useGetAllNotificationsQuery,
  useGetAllNotificationsPreferencesQuery,
  useMarkAsRedNotificationMutation

} = notificationApiService;
