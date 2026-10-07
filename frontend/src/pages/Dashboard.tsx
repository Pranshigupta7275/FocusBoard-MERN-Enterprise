import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetUserProfileQuery,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from '../slices/apiSlice';

import { type RootState } from '../store';

import {
  LoadingState,
  EmptyState,
  ErrorState,
  TaskStats,
  TaskFilters,
  TaskCard,
  TaskModal,
  Pagination,
} from '../components/dashboard';

const LIMIT = 8;

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !userInfo,
  });

  const user = profileData?.user;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    data: tasksResponse,
    isLoading: isTasksLoading,
    isFetching: isTasksFetching,
    isError: isTasksError,
  } = useGetTasksQuery(
    {
      search: search.trim() || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      page,
      limit: LIMIT,
    },
    {
      skip: !userInfo,
    }
  );

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const tasks = tasksResponse?.data ?? [];
  const pagination = tasksResponse?.pagination;

  const stats = useMemo(() => {
    return {
      total: pagination?.totalCount ?? tasks.length,
      pending: tasks.filter((task) => task.status.toLowerCase() === 'pending').length,
      inProgress: tasks.filter((task) => task.status.toLowerCase() === 'in progress').length,
      completed: tasks.filter((task) => task.status.toLowerCase() === 'completed').length,
    };
  }, [tasks, pagination]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter]);

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isCreating || isUpdating) return;
    setIsModalOpen(false);
    setEditingTask(null);
  }, [isCreating, isUpdating]);

  const handleSubmit = useCallback(
    async (payload: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: string;
    }) => {
      if (!payload.title.trim()) {
        toast.error('Task title is required');
        return;
      }

      if (payload.title.trim().length > 200) {
        toast.error('Task title cannot exceed 200 characters');
        return;
      }

      if (payload.description.length > 2000) {
        toast.error('Description cannot exceed 2000 characters');
        return;
      }

      try {
        const body = {
          title: payload.title.trim(),
          description: payload.description.trim(),
          status: payload.status,
          priority: payload.priority,
          dueDate: payload.dueDate || null,
        };

        if (editingTask) {
          await updateTask({ id: editingTask._id, data: body }).unwrap();
          toast.success('Task updated successfully');
        } else {
          await createTask(body).unwrap();
          toast.success('Task created successfully');
        }

        closeModal();
      } catch (error) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || `Failed to ${editingTask ? 'update' : 'create'} task`);
      }
    },
    [editingTask, createTask, updateTask, closeModal]
  );

  const handleStatusChange = useCallback(
    async (task: Task, status: TaskStatus) => {
      try {
        await updateTask({ id: task._id, data: { status } }).unwrap();
        toast.success('Task status updated');
      } catch (error) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || 'Failed to update task status');
      }
    },
    [updateTask]
  );

  const handleDelete = useCallback(
    async (task: Task) => {
      try {
        await deleteTask(task._id).unwrap();
        toast.success('Task deleted');

        if (tasks.length === 1 && page > 1) {
          setPage((current) => current - 1);
        }
      } catch (error) {
        const apiError = error as { data?: { message?: string } };
        toast.error(apiError?.data?.message || 'Failed to delete task');
      }
    },
    [deleteTask, tasks.length, page]
  );

  const handleRetry = useCallback(() => {
    setPage((current) => current);
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm max-w-md w-full">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">Authentication required</h2>

          <p className="text-slate-500 mt-2 mb-6 text-sm">
            Please sign in to access your task dashboard.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const hasActiveFilters = Boolean(search || statusFilter || priorityFilter);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Task Management</p>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Good morning, {user?.name || user?.username || 'User'}
            </h1>

            <p className="text-slate-500 text-sm mt-1">Manage your tasks, stay organized, and keep your work moving forward.</p>
          </div>

          <div className="flex gap-2.5">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Admin Panel
              </button>
            )}

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </section>

        <section className="mb-8">
          <TaskStats {...stats} />
        </section>

        <section className="bg-white border border-slate-200 rounded-xl">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900">My Tasks</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage and track your tasks.</p>
              </div>
            </div>

            <TaskFilters
              search={search}
              status={statusFilter}
              priority={priorityFilter}
              onSearchChange={setSearch}
              onStatusChange={(value) => setStatusFilter(value)}
              onPriorityChange={(value) => setPriorityFilter(value)}
              onCreateTask={openCreateModal}
            />
          </div>

          {isTasksLoading && <LoadingState count={LIMIT} />}

          {!isTasksLoading && isTasksError && (
            <ErrorState onRetry={handleRetry} />
          )}

          {!isTasksLoading && !isTasksError && tasks.length > 0 && (
            <div className="p-4 sm:p-6 pt-0 space-y-2.5">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}

          {!isTasksLoading && !isTasksError && tasks.length === 0 && (
            <EmptyState hasFilters={hasActiveFilters} onCreateTask={openCreateModal} />
          )}

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              limit={pagination.limit}
              isFetching={isTasksFetching}
              onPageChange={setPage}
            />
          )}
        </section>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        editingTask={editingTask}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </main>
  );
};

export default Dashboard;
