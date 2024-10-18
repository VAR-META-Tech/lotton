import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { FC, HTMLAttributes, useCallback } from 'react';

interface ISummaryTicketsProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  total: number;
  titleClassName?: ISummaryTicketsProps['className'];
  valueClassName?: ISummaryTicketsProps['className'];
}

const SummaryTickets: FC<ISummaryTicketsProps> = ({ icon, title, total, titleClassName, valueClassName, ...props }) => {
  const totalNumber = total < 10 ? `0${total}` : total;

  const renderTitle = useCallback(() => {
    if (!icon) {
      return <span className={cn('font-bold', titleClassName)}>{title}</span>;
    }

    return (
      <HStack align={'center'}>
        <div className="w-[1.875rem] aspect-square flex justify-center items-center">{icon}</div>

        <span className={cn('font-bold', titleClassName)}>{title}</span>
      </HStack>
    );
  }, [icon, title, titleClassName]);

  return (
    <HStack pos={'apart'} spacing={16} align={'center'} {...props}>
      {renderTitle()}

      <span className={cn('font-bold', valueClassName)}>{totalNumber}</span>
    </HStack>
  );
};

export default SummaryTickets;
