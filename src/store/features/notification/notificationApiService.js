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
    getNotifications: builder.query({
      query: (params) => {
        if (params) {
          return {
            url: `/settings/notification`,
            method: 'GET',
            params,
          };
        }
        return {
          url: `/settings/notification`,
          method: 'GET',
        };
      },
      providesTags: ['notification'],
    }),
    getAllNotificationsPreferences: builder.query({
      query: () => ({
        url: `/settings/notification/preferences`,
        method: 'GET',
      }),
      providesTags: ['notificationPreferences'],
    }),
    markAsRedNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/settings/notification/${notificationId}/red`,
        method: 'PUT',

      }),
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useUpdateEmailNotificationMutation,
  useUpdateBrowserNotificationMutation,
  useGetNotificationsQuery,
  useGetAllNotificationsPreferencesQuery,
  useMarkAsRedNotificationMutation

} = notificationApiService;
