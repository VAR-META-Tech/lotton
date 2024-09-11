'use client';

import * as React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { QueryClientProviderWrapper } from '@/lib/query-provider';
import { env, GOOGLE_CLIENT_ID } from '@/lib/const';
import { GoogleOAuthProvider } from '@react-oauth/google';

const manifestUrl = `${env.APP_URL}/tonconnect-manifest.json`;
// const manifestUrl =
//   'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
      </TonConnectUIProvider>
    </GoogleOAuthProvider>
  );
}
