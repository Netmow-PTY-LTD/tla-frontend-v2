import { baseApi } from '../../baseApi/baseApi';

const galleryApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGalleries: builder.query({
      query: (params) => ({
        url: '/gallery/list',
        method: 'GET',
        params,
      }),
      providesTags: ['galleries'],
    }),
    getGalleryById: builder.query({
      query: (galleryId) => ({
        url: `/gallery/${galleryId}`,
        method: 'GET',
      }),
      providesTags: ['gallery'],
    }),
    createGallery: builder.mutation({
      query: (formData) => ({
        url: '/gallery/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['galleries', 'gallery'],
    }),
    updateGallery: builder.mutation({
      query: ({ galleryId, formData }) => ({
        url: `/gallery/${galleryId}/update`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['galleries', 'gallery'],
    }),
    deleteGallery: builder.mutation({
      query: (galleryId) => ({
        url: `/gallery/${galleryId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['galleries', 'gallery'],
    }),
  }),
});

export const {
  useGetAllGalleriesQuery,
  useGetGalleryByIdQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryApiService;
