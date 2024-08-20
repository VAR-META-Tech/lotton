import { Button } from '@/components/ui/button';

import { ConnectWallet } from './components/ConnectWallet';

export const LandingPageModule = () => {
  return (
    <div className="container">
      <ConnectWallet />

      <Button>Button</Button>
    </div>
  );
};
