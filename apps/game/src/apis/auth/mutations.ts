import { type ApiError } from '@/types';
import { createMutation } from 'react-query-kit';

import { emailSignInRequest, googleSignInRequest } from './requests';
import { type IGoogleSignInRequest, type ISignInRequest, type ISignInResponse } from './types';

export const useSignInWithGoogleMutation = createMutation<ISignInResponse, IGoogleSignInRequest, ApiError>({
  mutationFn: googleSignInRequest,
});

export const useSignInMutation = createMutation<ISignInResponse, ISignInRequest, ApiError>({
  mutationFn: emailSignInRequest,
});
