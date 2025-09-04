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
    getDashboardBarChartData: builder.query({
      query: ({ year, month }) => ({
        url: `/admin/dashboard/bar-chart`,
        method: 'GET',
        params: { year, month },
      }),
      providesTags: ['dashboard-stats'],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: `/admin/dashboard/stats`,
        method: 'GET',
      }),
      providesTags: ['dashboard-stats'],
    }),
  }),
});

export const {
  useGetDashboardSChartDataQuery,
  useGetDashboardBarChartDataQuery,
  useGetDashboardStatsQuery,
} = dashboardStatsApiService;
