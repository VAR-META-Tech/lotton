import React from 'react';

import FaqContent from './components/FaqContent';
import FaqHead from './components/FaqHead';

const FaqPage = () => {
  return (
    <div className="pb-20 pt-10 text-white space-y-5">
      <FaqHead />

      <FaqContent />
    </div>
  );
};

export default FaqPage;
