'use client';

import { CP } from '@/types';
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import withAuth from '@/lib/withAuth';

const MainLayout = ({ children }: CP) => {
  return (
    <div>
      <Sidebar />

      <div>
        <Header />
        <main className='ml-[1rem] md:ml-[16.25rem] mt-[6rem] md:mt-[5rem]'>{children}</main>
      </div>
    </div>
  );
};

export default withAuth(MainLayout);
