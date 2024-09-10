import { type ApiError } from '@/types';
import { createMutation } from 'react-query-kit';

import { confirmClaimRequest, getClaimSignatureRequest } from './requests';
import { IConfirmClaimParams, IGetClaimSignatureData, IGetClaimSignatureParams } from './types';

export const useGetClaimSignatureMutation = createMutation<IGetClaimSignatureData, IGetClaimSignatureParams, ApiError>({
  mutationFn: getClaimSignatureRequest,
});

export const useConfirmClaimMutation = createMutation<any, IConfirmClaimParams, ApiError>({
  mutationFn: confirmClaimRequest,
});
