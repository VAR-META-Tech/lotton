import { type ApiError } from '@/types';
import { createMutation } from 'react-query-kit';

import { loginByWalletRequest } from './requests';
import { ILoginByWalletData, ILoginByWalletRequest } from './types';

export const useLoginByWalletMutation = createMutation<ILoginByWalletData, ILoginByWalletRequest, ApiError>({
  mutationFn: loginByWalletRequest,
});
