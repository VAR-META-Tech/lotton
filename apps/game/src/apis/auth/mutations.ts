import { type ApiError } from '@/types';
import { createMutation } from 'react-query-kit';

import { loginByWalletRequest } from './requests';
import { ILoginByWalletRequest, ILoginByWalletResponse } from './types';

export const useLoginByWalletMutation = createMutation<ILoginByWalletResponse, ILoginByWalletRequest, ApiError>({
  mutationFn: loginByWalletRequest,
});
