import React from 'react';

import dynamic from 'next/dynamic';

const FaqContent = dynamic(() => import('./components/FaqContent'));
const FaqHead = dynamic(() => import('./components/FaqHead'));

const FaqPage = () => {
  return (
    <div className="pb-20 pt-10 text-white space-y-5">
      <FaqHead />

      <FaqContent />
    </div>
  );
};

export default FaqPage;
