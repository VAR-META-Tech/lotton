import React from 'react';

import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

import { LoaderCircle } from 'lucide-react';

const FullScreenLoading: FCC<{ loading?: boolean }> = ({ loading, children }) => {
  if (!loading) return null;
  return (
    <div className={cn('animate-spin fixed inset-0 z-[100] flex items-center justify-center')}>
      <LoaderCircle size='3rem' />
    </div>
  );
};

export default FullScreenLoading;
