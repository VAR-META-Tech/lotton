/* eslint-disable no-unused-vars */
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

interface IStore {
  poolId: number | undefined;
  roundId: number | undefined;
}

export interface IDetailTicketStore {
  store: IStore;
  setStore: (data: IStore) => void;
  setPoolId: (data: number | undefined) => void;
  setRoundId: (data: number | undefined) => void;
  clear: () => void;
}

const useBaseDetailTicketStore = create<IDetailTicketStore>()((set) => ({
  store: {
    poolId: undefined,
    roundId: undefined,
  },
  setStore: (data) => set((state) => ({ store: { ...state.store, ...data } })),
  setPoolId: (data) => set((state) => ({ store: { ...state.store, poolId: data } })),
  setRoundId: (data) => set((state) => ({ store: { ...state.store, roundId: data } })),
  clear: () =>
    set(() => ({
      store: {
        poolId: undefined,
        roundId: undefined,
      },
    })),
}));

export const useDetailTicketStore = createSelectorFunctions(useBaseDetailTicketStore);
