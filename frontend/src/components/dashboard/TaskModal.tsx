import { type JSX, useEffect, useCallback, type FormEvent, useState } from 'react';
import { type Task, type TaskStatus, type TaskPriority } from '../../slices/apiSlice';

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => void;
  isSubmitting: boolean;
}

const STATUS_OPTIONS: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High'];

const TaskModal = ({
  isOpen,
  editingTask,
  onClose,
  onSubmit,
  isSubmitting,
}: TaskModalProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setStatus(
        editingTask.status.toLowerCase() === 'completed'
          ? 'Completed'
          : editingTask.status.toLowerCase() === 'in progress'
            ? 'In Progress'
            : 'Pending'
      );
      setPriority(
        editingTask.priority.toLowerCase() === 'high'
          ? 'High'
          : editingTask.priority.toLowerCase() === 'low'
            ? 'Low'
            : 'Medium'
      );
      setDueDate(editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      setDueDate('');
    }
  }, [isOpen, editingTask]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
      });
    },
    [title, description, status, priority, dueDate, onSubmit]
  );

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {editingTask
                ? 'Update the task details below.'
                : 'Add a new task to your workspace.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 mb-1.5">
              Task Title <span className="text-red-500" aria-hidden="true">*</span>
            </label>

            <input
              id="task-title"
              type="text"
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Complete API documentation"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm placeholder:text-slate-400 transition-colors"
              autoFocus
            />
            <p className="text-[0.6875rem] text-slate-400 mt-1 text-right">
              {title.length}/200
            </p>
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>

            <textarea
              id="task-description"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add details about this task..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm placeholder:text-slate-400 transition-colors resize-none"
            />
            <p className="text-[0.6875rem] text-slate-400 mt-1 text-right">
              {description.length}/2000
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm text-slate-700 transition-colors"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 mb-1.5">
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm text-slate-700 transition-colors"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date" className="block text-sm font-medium text-slate-700 mb-1.5">
                Due Date
              </label>

              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm text-slate-700 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : editingTask
                  ? 'Save Changes'
                  : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
