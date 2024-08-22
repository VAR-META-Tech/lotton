import React, { FC, HTMLAttributes, memo, ReactNode, useMemo } from 'react';

import { cn } from '@/lib/utils';
import { HStack, VStack } from '@/components/ui/Utilities';

interface Props extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  title: string;
  description: React.ReactNode | string;
}

const HowToPlayItem: FC<Props> = ({ icon, title, description, className, ...props }) => {
  const descriptionText = useMemo(() => {
    if (typeof description === 'string') {
      return <p className="text-gray-color text-xs text-justify">{description}</p>;
    }

    return description;
  }, [description]);

  return (
    <HStack align={'start'} spacing={12} {...props} className={cn('w-full', className)}>
      {icon}

      <VStack className="flex-1" spacing={8}>
        <span className="text-white text-base">{title}</span>

        {descriptionText}
      </VStack>
    </HStack>
  );
};

export default memo(HowToPlayItem);
