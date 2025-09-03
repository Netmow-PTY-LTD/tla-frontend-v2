import { baseApi } from '@/store/baseApi/baseApi';

const dashboardStatsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSChartData: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/dashboard/chart`,
        method: 'GET',
        params: { startDate, endDate },
      }),
      providesTags: ['dashboard-stats'],
    }),
    getDashboardStats: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/dashboard/stats`,
        method: 'GET',
        params: { startDate, endDate },
      }),
      providesTags: ['dashboard-stats'],
    }),
  }),
});

export const { useGetDashboardSChartDataQuery, useGetDashboardStatsQuery } =
  dashboardStatsApiService;
