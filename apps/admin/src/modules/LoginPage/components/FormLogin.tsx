'use client'

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const FormLogin = () => {
  const router = useRouter();

  const loginGoogle = useGoogleLogin({
    onSuccess: ({ access_token }) => {
      router.replace(ROUTES.POOL);
    },
    onError: () => {
      router.push(ROUTES.LOGIN);
    }
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


            <Button className='px-5 py-[.625rem] w-[20.8125rem]' variant="secondary" onClick={() => loginGoogle()}>
              Login with Google
            </Button>
          </VStack>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;