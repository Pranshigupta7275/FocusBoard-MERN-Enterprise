import { type JSX } from 'react';

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateTask: () => void;
}

const EmptyState = ({ hasFilters, onCreateTask }: EmptyStateProps): JSX.Element => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mt-5">
        {hasFilters ? 'No matching tasks' : 'No tasks yet'}
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
        {hasFilters
          ? 'Try adjusting your search or filters to find what you are looking for.'
          : 'You do not have any tasks yet. Create your first task to get started.'}
      </p>

      {!hasFilters && (
        <button
          onClick={onCreateTask}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
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
      )}
    </div>
  );
};

export default EmptyState;
