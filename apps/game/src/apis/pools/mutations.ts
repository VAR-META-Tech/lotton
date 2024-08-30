import { type ApiError } from '@/types';
import { createMutation } from 'react-query-kit';

import { getClaimSignatureRequest } from './requests';
import { IGetClaimSignatureData, IGetClaimSignatureParams } from './types';

export const useGetClaimSignatureMutation = createMutation<IGetClaimSignatureData, IGetClaimSignatureParams, ApiError>({
  mutationFn: getClaimSignatureRequest,
});
