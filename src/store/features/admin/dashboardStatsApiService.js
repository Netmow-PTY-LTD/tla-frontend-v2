import { baseApi } from '@/store/baseApi/baseApi';

const dashboardStatsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSChartData: builder.query({
      query: (arg) => {
        if (arg) {
          const { startDate, endDate } = arg;
          return {
            url: `/admin/dashboard/chart`,
            method: 'GET',
            params: { startDate, endDate },
          };
        }
        return {
          url: `/admin/dashboard/chart`,
          method: 'GET',
        };
      },
      providesTags: ['dashboard-stats'],
    }),
    getDashboardBarChartData: builder.query({
      query: (filterType) => {
        if (filterType) {
          return {
            url: `/admin/dashboard/bar-chart`,
            method: 'GET',
            params: { filterType },
          };
        }
        return {
          url: `/admin/dashboard/bar-chart`,
          method: 'GET',
        };
      },
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
