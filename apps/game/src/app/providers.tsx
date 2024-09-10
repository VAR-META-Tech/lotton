'use client';

import * as React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { QueryClientProviderWrapper } from '@/lib/query-provider';
import { env } from '@/lib/const';

const manifestUrl = `${env.APP_URL}/tonconnect-manifest.json`;

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
    </TonConnectUIProvider>
  );
}
