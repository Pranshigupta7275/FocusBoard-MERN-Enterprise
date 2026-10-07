import { type JSX, type FormEvent, type ChangeEvent } from 'react';

interface TaskFiltersProps {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCreateTask: () => void;
}

const TaskFilters = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCreateTask,
}: TaskFiltersProps): JSX.Element => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onStatusChange(event.target.value);
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onPriorityChange(event.target.value);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-2.5">
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        <input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search tasks by title or description..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm placeholder:text-slate-400 transition-colors"
          aria-label="Search tasks"
        />
      </div>

      <select
        value={status}
        onChange={handleStatusChange}
        className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm text-slate-700 transition-colors"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={handlePriorityChange}
        className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none text-sm text-slate-700 transition-colors"
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        type="button"
        onClick={onCreateTask}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Task
      </button>
    </form>
  );
};

export default TaskFilters;
