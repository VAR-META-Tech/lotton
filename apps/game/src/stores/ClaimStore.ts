import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

export interface IClaimStore {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (data: boolean) => void;
  clear: () => void;
}

const useBaseClaimStore = create<IClaimStore>()((set) => ({
  isOpen: false,
  setIsOpen: (data) => set(() => ({ isOpen: data })),
  clear: () =>
    set(() => ({
      isOpen: false,
    })),
}));

export const useClaimStore = createSelectorFunctions(useBaseClaimStore);
