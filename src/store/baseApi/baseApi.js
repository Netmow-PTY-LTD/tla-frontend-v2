import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { toast } from 'sonner';
import { logOut, setUser } from '../features/auth/authSlice';

// Basic baseQuery with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    if (token) {
      headers.set('Authorization', token);
    }
    return headers;
  },
});

// Enhanced baseQuery with refresh token logic
const baseQueryWithRefreshToken = async (arg, api, extraOptions) => {
  let result = await baseQuery(arg, api, extraOptions);

  if (result.error?.status === 404 || result.error?.status === 403) {
    const errorData = result.error.data;
    const url = typeof arg === 'string' ? arg : arg.url || '';

    // Check if the URL matches your change-password endpoint
    if (!url.includes('/auth/change-password')) {
      toast.error(errorData?.message || 'Request failed', {
        position: 'top-right',
        style: { backgroundColor: 'red', color: 'white' },
      });
    }
  }

  if (result.error?.status === 401) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/refresh-token`,
        {
          credentials: 'include',
          method: 'POST',
        }
      );
      const data = await res.json();
      if (data?.data?.accessToken) {
        const user = api.getState().auth.user;
        api.dispatch(setUser({ user, token: data.data.accessToken }));
        // Retry original request with new token
        result = await baseQuery(arg, api, extraOptions);
      } else {
        api.dispatch(logOut());
        //  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/logout`, {
        //     credentials: 'include',
        //     method: 'POST',
        //   }).catch(console.error);

        await api.dispatch(baseApi.endpoints.authLogOut.initiate()).unwrap();
      }
    } catch (err) {
      api.dispatch(logOut());
      //  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/logout`, {
      //     credentials: 'include',
      //     method: 'POST',
      //   }).catch(console.error);

      await api.dispatch(baseApi.endpoints.authLogOut.initiate()).unwrap();
    }
  }

  return result;
};

// Create the API instance
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    'service',
    'userInfo',
    'Country',
    'question',
    'option',
    'range',
    'leadService',
    'lead',
    'user',
    'response',
    'notification',
    'credit-payment',
    'payment-method',
    'user-credit-stats',
    'next-offer',
    'transaction-history',
    'notificationPreferences',
    'app-settings',
    'category',
    'transaction-history-list',
    'response-my',
    'response-list',
    'lead-list-admin',
    'lead-list',
    'lead-wise-response',
    'Country-list',
    'zipcode',
    'zipcode-list',
    'range-list',
    'public-user',
    'public-user-list',
    'public-category',
    'category-list',
    'question-wise-option',
    'option-list',
    'service-wise-question',
    'question-list',
    'service-list',
    'country-wise-map',
    'country-wise-map-list',
    'all-users',
    'request',
    'requests',
    'lawyer-suggestion',
    'lead-my',
    'recent-visitor',
    'client-cases',
    'all-client',
    'all-lawyer',
    'dashboard-stats',
  ],
  endpoints: () => ({}),
});
