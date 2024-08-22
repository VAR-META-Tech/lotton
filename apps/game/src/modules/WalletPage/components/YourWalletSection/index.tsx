import React, { useMemo } from 'react';

import Tabs from '@/components/Tabs';

import { TAB_DATA, TAB_VALUE } from '../../utils/const';
import TransactionTab from './TransactionTab';
import WalletTab from './WalletTab';

const YourWalletSection = () => {
  const [tab, setTab] = React.useState(TAB_VALUE.WALLET);

  const renderTab = useMemo(() => {
    if (tab === TAB_VALUE.WALLET) return <WalletTab />;

    return <TransactionTab />;
  }, [tab]);

  return (
    <div className="container px-5 pb-20 pt-10 space-y-10">
      <span className="text-2xl text-white">Your wallet</span>

      <Tabs layoutId="wallet" data={TAB_DATA} value={tab} onChange={setTab} />

      {renderTab}
    </div>
  );
};

export default YourWalletSection;
