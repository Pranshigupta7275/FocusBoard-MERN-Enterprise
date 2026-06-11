import { apiSlice } from './apiSlice';

const USERS_URL = '/api/auth';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logoutApiCall: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
  }),
});

// RTK Query automatically generates these custom React hooks for you!
export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutApiCallMutation 
} = usersApiSlice;