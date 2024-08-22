import React, { memo } from 'react';
import { Icons } from '@/assets/icons';

import { HStack } from '@/components/ui/Utilities';

const PoolRound = () => {
  return (
    <div className="border-x-navigate-tab border-x text-white px-5 py-4">
      <HStack pos={'apart'} spacing={12}>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Round</span> <span className="bg-navigate-tab px-3 py-1 rounded-lg">03</span>
          </div>

          <div className="text-xs">Draw Aug 16, 2024, 10:00 PM</div>
        </div>

        <div className="space-x-5">
          <button>
            <Icons.arrowLeft color="#fff" />
          </button>

          <button>
            <Icons.arrowRight color="#fff" />
          </button>
        </div>
      </HStack>
    </div>
  );
};

export default memo(PoolRound);
