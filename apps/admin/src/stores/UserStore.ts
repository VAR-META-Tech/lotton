import type { ILoginResponse, IUser } from '@/apis/auth';
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IMeQueryStore {
  status: 'waiting' | 'ready';
  user: IUser;
  accessToken: string;
  refreshToken: string;
  setStore: (data: ILoginResponse) => void;
  setUser: (data: IUser) => void;
  setAccessToken: (data: string) => void;
  setRefreshToken: (data: string) => void;
  logout: () => void;
}

const useBaseUserStore = create<IMeQueryStore>()(
  persist(
    (set) => ({
      status: 'waiting',
      accessToken: '',
      refreshToken: '',
      user: {} as IUser,
      setStore: (data) => set((_) => data),
      setUser: (data) => set((state) => ({ ...state, user: data })),
      setAccessToken: (data) => set((state) => ({ ...state, accessToken: data })),
      setRefreshToken: (data) => set((state) => ({ ...state, refreshToken: data })),
      logout: () =>
        set(() => ({
          accessToken: '',
          refreshToken: '',
          user: {} as IUser,
        })),
    }),
    {
      name: 'admin-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.status = 'ready';
      },
    }
  )
);

export const useUserStore = createSelectorFunctions(useBaseUserStore);
