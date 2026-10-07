import { type JSX, memo } from 'react';
import { type Task, type TaskStatus, type TaskPriority } from '../../slices/apiSlice';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'in progress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  low: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const formatDate = (date?: string | null): string => {
  if (!date) return 'No due date';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'No due date';
  return parsed.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const normalizeStatus = (status?: string): TaskStatus => {
  const normalized = status?.toLowerCase();
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'in progress') return 'In Progress';
  return 'Pending';
};

const TaskCard = memo(({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdating,
  isDeleting,
}: TaskCardProps): JSX.Element => {
  const status = normalizeStatus(task.status);
  const priority = task.priority as TaskPriority;
  const isCompleted = status === 'Completed';

  const statusStyle = STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.pending;
  const priorityStyle = PRIORITY_STYLES[priority.toLowerCase()] || PRIORITY_STYLES.medium;

  const handleStatusClick = (): void => {
    if (isCompleted || isUpdating) return;
    const nextStatus: TaskStatus = status === 'Pending' ? 'In Progress' : 'Completed';
    onStatusChange(task, nextStatus);
  };

  return (
    <article className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3
              className={`font-semibold text-[0.9375rem] leading-snug ${
                isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[0.6875rem] font-semibold tracking-wide uppercase ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              {priority}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[0.6875rem] font-medium ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {status}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Due: <span className="font-medium text-slate-700">{formatDate(task.dueDate)}</span>
            </span>

            {task.createdAt && (
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Created: <span className="font-medium text-slate-700">{formatDate(task.createdAt)}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:ml-4">
          {!isCompleted && (
            <button
              onClick={handleStatusClick}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isUpdating ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : status === 'Pending' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Start
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Complete
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit
          </button>

          <button
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.061-.94-1.75-1.816-1.551a9.004 9.004 0 00-7.184 0c-.876.199-1.816.49-1.816 1.551v.916" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
