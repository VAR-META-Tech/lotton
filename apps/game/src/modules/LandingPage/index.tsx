import React from 'react';

import PoolCard from './components/PoolCard';

const LandingPage = () => {
  return (
    <div className="container py-10 pb-24 space-y-8">
      <div className="text-white text-center w-full text-2xl">Get your tickets now!</div>

      <PoolCard />
    </div>
  );
};

export default LandingPage;
