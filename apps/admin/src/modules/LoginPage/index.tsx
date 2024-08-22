'use client';

import React from 'react';

import FormLogin from './components/FormLogin';
import { useUserStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

const LoginPage = () => {
  return (
    <FormLogin />
  );
};

export default LoginPage;
