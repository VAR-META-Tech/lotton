import React from 'react';
import dynamic from 'next/dynamic';

import { Carousel } from '@/components/ui/carousel';
import HowToWin from './components/HowToWin';
import PrizePool from './components/PrizePool';

const HowToPlay = dynamic(() => import('./components/HowToPlay'));
const PoolList = dynamic(() => import('./components/PoolList'));

const LandingPage = () => {
  return (
    <div className="container py-10 pb-24 space-y-8">
      <div className="text-white text-center w-full text-2xl">Get your tickets now!</div>

      <Carousel>
        <PoolList />
      </Carousel>

      <HowToPlay />

      <HowToWin />

      <PrizePool />
    </div>
  );
};

export default LandingPage;
