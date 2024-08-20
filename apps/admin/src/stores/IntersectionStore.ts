import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

type TTargetInView =
  | 'connectWallet'
  | 'confirmInvest'
  | 'loginConnect'
  | 'emailLogin'
  | 'socialsLogin'
  | 'whitelist'
  | 'lastchance'
  | 'restakeGuide'
  | 'insufficientAmount'
  | '';

export type IModalStore = {
  targetInView: TTargetInView;
  setTargetInView: (target: TTargetInView) => void;
};

const useBaseIntersectionStore = create<IModalStore>((set) => ({
  targetInView: '',
  setTargetInView: (target) =>
    set(() => ({
      targetInView: target,
    })),
}));

export const useIntersectionStore = createSelectorFunctions(useBaseIntersectionStore);
