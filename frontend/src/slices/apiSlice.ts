import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ====================
// Types
// ====================

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

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
  description?: string;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  dueDate?: string | null;

  createdBy?: string | User;
  assignedTo?: string | User;

  // Kept for compatibility with existing admin/enterprise UI.
  isCompleted?: boolean;
  completed?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface TaskPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: TaskPagination;
  message?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface GetTasksParams {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface AuthCredentials {
  email?: string;
  password?: string;
  name?: string;
  username?: string;
}

interface PartialRootState {
  auth: {
    userInfo: {
      token: string;
    } | null;
  };
}

interface DashboardStats {
  totalUsers?: number;
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
  [key: string]: number | undefined;
}

interface DashboardStatsResponse {
  stats?: DashboardStats;
  [key: string]: unknown;
}

// ====================
// API
// ====================

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api`
      : 'http://localhost:5000/api',

    credentials: 'include',

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as PartialRootState).auth.userInfo?.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ['Task', 'User', 'Stats'],

  endpoints: (builder) => ({
    // ====================
    // Authentication
    // ====================

    login: builder.mutation<LoginResponse, AuthCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Task'],
    }),

    register: builder.mutation<LoginResponse, AuthCredentials>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Task', 'Stats'],
    }),

    // ====================
    // OTP
    // ====================

    requestOtp: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (emailData) => ({
        url: '/auth/request-otp',
        method: 'POST',
        body: emailData,
      }),
    }),

    verifyOtp: builder.mutation<
      LoginResponse,
      { email: string; otp: string }
    >({
      query: (otpData) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: otpData,
      }),
      invalidatesTags: ['User', 'Task'],
    }),

    // ====================
    // Tasks
    // ====================

    getTasks: builder.query<TasksResponse, GetTasksParams | void>({
      query: (params) => ({
        url: '/tasks',
        params: params || undefined,
      }),
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<
      ApiResponse<Task>,
      CreateTaskPayload
    >({
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task', 'Stats'],
    }),

    updateTask: builder.mutation<
      ApiResponse<Task>,
      { id: string; data: UpdateTaskPayload }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task', 'Stats'],
    }),

    deleteTask: builder.mutation<
      ApiResponse<{ id: string }>,
      string
    >({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task', 'Stats'],
    }),

    // ====================
    // Admin task assignment
    // ====================

    assignTask: builder.mutation<
      Task,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `/tasks/${id}/assign`,
        method: 'PUT',
        body: { userId },
      }),
      invalidatesTags: ['Task'],
    }),

    // ====================
    // User
    // ====================

    getUserProfile: builder.query<{ user: User }, void>({
      query: () => '/user/dashboard',
      providesTags: ['User'],
    }),

    // ====================
    // Admin
    // ====================

    getDashboardStats: builder.query<
      DashboardStatsResponse,
      void
    >({
      query: () => '/admin/stats',
      providesTags: ['Stats'],
    }),

    getUsers: builder.query<
      { data?: User[]; users?: User[] } | User[],
      void
    >({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
  }),
});

// ====================
// Hooks
// ====================

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