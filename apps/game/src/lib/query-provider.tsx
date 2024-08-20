'use client';

import { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from './get-query-client';

export const QueryClientProviderWrapper = (props: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
