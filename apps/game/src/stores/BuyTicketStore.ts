import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

export interface IBuyTicketStore {
  poolId: number | undefined;
  // eslint-disable-next-line no-unused-vars
  setPoolId: (data: number | undefined) => void;
  clear: () => void;
}

const useBaseBuyTicketStore = create<IBuyTicketStore>()((set) => ({
  poolId: undefined,
  setPoolId: (data) => set(() => ({ poolId: data })),
  clear: () =>
    set(() => ({
      poolId: undefined,
    })),
}));

export const useBuyTicketStore = createSelectorFunctions(useBaseBuyTicketStore);
