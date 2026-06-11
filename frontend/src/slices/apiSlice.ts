import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- Interfaces ---
export interface User {
  _id: string;
  username: string;
  name?: string;         
  email: string;
  role: string;
}

export interface Task {
  _id: string;
  title: string;
  status?: string;        
  completed?: boolean;
  isCompleted?: boolean;
  createdBy?: string | User;   // FIXED: Replaced 'any'
  user?: User;                 // FIXED: Replaced 'any'
  assignedTo?: string | User;  // NEW: Added for Admin task assignment functionality
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// NEW: Strict interface for login/register payloads
interface AuthCredentials {
  email?: string;
  password?: string;
  name?: string;
  username?: string;
}

// NEW: Strict interface to prevent circular dependency with store.ts
interface PartialRootState {
  auth: {
    userInfo: {
      token: string;
    } | null;
  };
}

// --- API Slice ---
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include', 
    prepareHeaders: (headers, { getState }) => {
      // FIXED: Replaced 'any' with PartialRootState
      const token = (getState() as PartialRootState).auth.userInfo?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task', 'User', 'Stats'],
  
  endpoints: (builder) => ({
    // --- Auth Endpoints ---
    // FIXED: Replaced 'any' with AuthCredentials
    login: builder.mutation<LoginResponse, AuthCredentials>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
      invalidatesTags: ['User', 'Task'],
    }),

    // FIXED: Replaced 'any' with AuthCredentials
    register: builder.mutation<LoginResponse, AuthCredentials>({
      query: (userData) => ({ url: '/auth/register', method: 'POST', body: userData }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['User', 'Task', 'Stats'],
    }),

    // --- OTP Endpoints ---
    requestOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (emailData) => ({ url: '/auth/request-otp', method: 'POST', body: emailData }),
    }),

    verifyOtp: builder.mutation<LoginResponse, { email: string; otp: string }>({
      query: (otpData) => ({ url: '/auth/verify-otp', method: 'POST', body: otpData }),
      invalidatesTags: ['User', 'Task'],
    }),

    // --- Task Endpoints ---
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<Task, Partial<Task>>({
      query: (newTask) => ({ url: '/tasks', method: 'POST', body: newTask }),
      invalidatesTags: ['Task'],
    }),

    updateTask: builder.mutation<Task, { id: string; data: Partial<Task> }>({
      query: ({ id, data }) => ({ url: `/tasks/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Task'],
    }),

    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),

    // NEW: Assign Task Mutation for Admin Panel
    assignTask: builder.mutation<Task, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/assign`,
        method: 'PUT',
        body: { userId },
      }),
      invalidatesTags: ['Task'],
    }),

    // --- User Profile Endpoint ---
    getUserProfile: builder.query<{ user: User }, void>({
      query: () => '/user/dashboard',
      providesTags: ['User'],
    }),

    // --- Admin Endpoints ---
    // FIXED: Replaced 'any' with a generic Record type for flexible stats
    getDashboardStats: builder.query<Record<string, number | string>, void>({
      query: () => '/admin/stats',
      providesTags: ['Stats'],
    }),

    // FIXED: Replaced 'any' with an array of Users wrapper
    getUsers: builder.query<{ data?: User[], users?: User[] } | User[], void>({
      query: () => '/admin/users', 
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAssignTaskMutation, 
  useGetUserProfileQuery,
  useGetDashboardStatsQuery,
  useGetUsersQuery, 
} = apiSlice;