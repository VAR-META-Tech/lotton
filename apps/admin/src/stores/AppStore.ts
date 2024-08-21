import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

export interface IAppStore {
  openSideBar: boolean;
  toggleSidebar: () => void;
}

const useBaseAppStore = create<IAppStore>((set) => ({
  openSideBar: false,
  toggleSidebar: () => set(({ openSideBar }) => ({ openSideBar: !openSideBar })),
}));

export const useAppStore = createSelectorFunctions(useBaseAppStore);
