import { baseApi } from "@/store/baseApi/baseApi";


const testimonialsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    //  1️ Create Testimonial
    createTestimonial: builder.mutation({
      query: (data) => ({
        url: '/testimonials/add',
        method: 'POST',
        body: data, // form-data (handle via FormData)
      }),
      invalidatesTags: ['testimonial', 'testimonial-list'],
    }),

    //  2️ Get All Testimonials (with pagination + search)
    getAllTestimonials: builder.query({
      query: ({ search = '', page = 1, limit = 10 }) => ({
        url: '/testimonials/list',
        method: 'GET',
        params: { search, page, limit },
      }),
      providesTags: ['testimonial-list'],
    }),

    //  3️ Get Testimonial by ID
    getSingleTestimonial: builder.query({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: 'GET',
      }),
      providesTags: ['testimonial'],
    }),

    //  4️ Update Testimonial
    updateTestimonial: builder.mutation({
      query: ({ id, data }) => ({
        url: `/testimonials/${id}/update`,
        method: 'PATCH',
        body: data, // form-data (handle via FormData)
      }),
      invalidatesTags: ['testimonial', 'testimonial-list'],
    }),

    //  5️ Delete Testimonial
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/testimonials/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['testimonial', 'testimonial-list'],
    }),

  }),
});

export const {
  useCreateTestimonialMutation,
  useGetAllTestimonialsQuery,
  useGetSingleTestimonialQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApiService;
