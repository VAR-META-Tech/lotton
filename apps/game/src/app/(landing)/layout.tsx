'use client';

import { useState, type PropsWithChildren } from 'react';
import { AppContextProvider } from '@/context/app.context';

const Layout = ({ children }: PropsWithChildren) => {
  const [active, setActive] = useState<string | undefined>(undefined);
  return (
    <AppContextProvider value={{ activeNav: active, setActiveNav: setActive }}>
      <div className="relative flex flex-col">
        <main className="bg-background mx-auto min-h-screen w-full grow text-clip">{children}</main>
      </div>
    </AppContextProvider>
  );
};

export default Layout;
