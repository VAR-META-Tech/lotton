import { createSafeContext } from '@/lib/create-safe-context';

type AppContextProps = {};

export const [AppContextProvider, useAppContext] = createSafeContext<AppContextProps>(
  'AppContextProvider component was not found in tree'
);
