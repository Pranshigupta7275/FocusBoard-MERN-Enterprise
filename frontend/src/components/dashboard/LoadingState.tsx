import { type JSX, memo } from 'react';

interface LoadingStateProps {
  count?: number;
}

const LoadingState = ({ count = 6 }: LoadingStateProps): JSX.Element => {
  return (
    <div className="p-4 sm:p-6 space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 animate-pulse"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="h-4 bg-slate-100 rounded-md w-3/4" />
              <div className="h-3.5 bg-slate-50 rounded w-full max-w-md" />
              <div className="flex gap-2">
                <div className="h-5 bg-slate-50 rounded-md w-14" />
                <div className="h-5 bg-slate-50 rounded-md w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-slate-50 rounded-md w-14" />
              <div className="h-8 bg-slate-50 rounded-md w-14" />
              <div className="h-8 bg-slate-50 rounded-md w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(LoadingState);
