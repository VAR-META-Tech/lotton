import React from 'react';

import { Carousel } from '@/components/ui/carousel';

import PoolList from './components/PoolList';

const LandingPage = () => {
  return (
    <div className="container py-10 pb-24 space-y-8">
      <div className="text-white text-center w-full text-2xl">Get your tickets now!</div>

      <Carousel>
        <PoolList />
      </Carousel>
    </div>
  );
};

export default LandingPage;
