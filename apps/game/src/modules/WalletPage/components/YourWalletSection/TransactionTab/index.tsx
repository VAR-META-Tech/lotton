import React from 'react';

import RecentTransaction from './RecentTransaction';

const TransactionTab = () => {
  return (
    <div className="space-y-5">
      <span className="text-base font-bold text-white">Recent transactions</span>

      <RecentTransaction />
    </div>
  );
};

export default TransactionTab;
