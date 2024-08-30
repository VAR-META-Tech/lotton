'use client'

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSignInWithGoogleMutation } from '@/apis/auth';
import { useUserStore } from '@/stores';

const FormLogin = () => {
  const router = useRouter();
  const setAccessToken = useUserStore.use.setAccessToken();
  const setRefreshToken = useUserStore.use.setRefreshToken();

  const { mutate: loginCredential, isPending } = useSignInWithGoogleMutation({
    onSuccess: ({ data: { tokens } }) => {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      router.replace(ROUTES.POOL);
      toast.success('Login successfully!');
    },
    onError: (error: any) => {
      if (error.code === 403 || error.code === 401) {
        toast.error('Your email address is not authorized to access this site.');
        return;
      }
      toast.error(`Login fail with error: ${error.message}`);
    },
  })

  const loginGoogle = useGoogleLogin({
    onSuccess: ({ access_token }) => {
      loginCredential({ accessToken: access_token });
    },
  });

  return (
    <div className='flex justify-center items-center w-[100vw] h-[100vh]'>
      <div className="w-[56.25rem] h-[100vh] md:h-[35.25rem] bg-white rounded-[.625rem] mx-auto overflow-hidden">
        <div className='w-full h-full flex flex-col md:flex-row jus md:items-center md:gap-10'>
          <div className='relative md:w-[50%] w-full md:h-full h-[50%]'>
            <Image src='/images/login-bg.png' alt='' fill className='object-cover'/>
          </div>

          <VStack spacing={32} className='mb-28 p-4 md:p-0'>
            <VStack spacing={8}>
              <p className='text-2xl font-bold'>Login</p>
              <p className='text-base font-light'>Welcome to TON game</p>
            </VStack>

            <Button
              className='px-5 py-[.625rem] w-[20.8125rem]'
              loading={isPending}
              variant="secondary"
              onClick={() => loginGoogle()}
            >
              Login with Google
            </Button>
          </VStack>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;