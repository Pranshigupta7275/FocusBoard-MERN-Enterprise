import { type JSX } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  totalCount,
  limit,
  isFetching,
  onPageChange,
}: PaginationProps): JSX.Element => {
  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  if (totalPages <= 1) return null;

  const handlePrevious = (): void => {
    if (page > 1 && !isFetching) {
      onPageChange(page - 1);
    }
  };

  const handleNext = (): void => {
    if (page < totalPages && !isFetching) {
      onPageChange(page + 1);
    }
  };

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="border-t border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        Showing{' '}
        <span className="font-medium text-slate-700">
          {startItem}–{endItem}
        </span>{' '}
        of{' '}
        <span className="font-medium text-slate-700">{totalCount}</span>{' '}
        tasks
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={page <= 1 || isFetching}
          className="px-2.5 py-1.5 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>

        <div className="flex items-center gap-0.5">
          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1.5 text-sm text-slate-400 select-none"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                disabled={isFetching}
                className={`min-w-[2rem] px-2 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-40 ${
                  pageNumber === page
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                aria-current={pageNumber === page ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages || isFetching}
          className="px-2.5 py-1.5 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
