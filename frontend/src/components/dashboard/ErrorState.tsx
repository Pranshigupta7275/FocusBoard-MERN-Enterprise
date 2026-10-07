import { type JSX } from 'react';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps): JSX.Element => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
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
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mt-5">
        Unable to load tasks
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
        Something went wrong while fetching your tasks. Please try again.
      </p>

      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
