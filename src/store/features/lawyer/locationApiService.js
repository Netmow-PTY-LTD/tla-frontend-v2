import { baseApi } from '../../baseApi/baseApi';

export const locationApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLocation: builder.mutation({
      query: (data) => ({
        url: '/user-location-service-map/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['location','lead-list'],
    }),

    getAllLocations: builder.query({
      query: () => ({
        url: '/user-location-service-map/list',
        method: 'GET',
      }),
      providesTags: ['location'],
    }),

    getSingleLocation: builder.query({
      query: (id) => ({
        url: `/user-location-service-map/${id}`,
        method: 'GET',
      }),
      providesTags: ['location'],
    }),

    updateLocation: builder.mutation({
      query: (body) => {
        return {
          url: `/user-location-service-map/${body.id}/update`,
          method: 'PUT',
          body: body.body,
        };
      },
      invalidatesTags: ['location','lead-list'],
    }),

    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `/user-location-service-map/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['location'],
    }),
  }),
});

export const {
  useCreateLocationMutation,
  useGetAllLocationsQuery,
  useGetSingleLocationQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationApiService;

