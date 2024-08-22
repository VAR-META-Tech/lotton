import React from 'react';
import { Button } from './button';
import { DOTS, usePagination } from '@/hooks/usePagination';
import { cn } from '@/lib/utils';

type Props = {
  onPageChange: (pageNumber: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
};

const Pagination = (props: Props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (paginationRange?.length === 0) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex items-center justify-end gap-4 py-3">
      <Button size={'sm'} className='font-bold' variant="outline" onClick={onPrevious} disabled={currentPage === 1}>
        {'<'}
      </Button>
      <p className="min-w-[9.375rem] text-center md:hidden">
        Page <b>1</b> of <b>10</b>
      </p>

      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return (
            <div className="hidden md:block" key={pageNumber + i}>
              {pageNumber}
            </div>
          );
        }

        return (
          <Button
            size={'sm'}
            key={pageNumber}
            variant={`${pageNumber === currentPage ? 'default' : 'outline'}`}
            className={cn('w-9', pageNumber === currentPage ? 'bg-[#1D4ED8]' : '')}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </Button>
        );
      })}
      <Button size={'sm'} className='font-bold' variant="outline" onClick={onNext} disabled={currentPage === lastPage}>
        {'>'}
      </Button>
    </div>
  );
};

export default Pagination;
