import { baseApi } from '@/store/baseApi/baseApi';

const contactApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApiService;
