import { Icons } from '@/assets/icons';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { FCC } from '@/types';

interface ITicketMatchProps {
  code: string;
  ticketNumber: number;
  matched: number;
}

const TicketMatch: FCC<ITicketMatchProps> = ({ code, ticketNumber, matched = 0 }) => {
  const codeSplit = code.split('');

  const getMatchedTitle = () => {
    if (matched === 0) return '';
    if (matched === code.length) return 'Matched all';
    return 'Matched first ' + matched;
  };

  return (
    <div className="grid grid-cols-10 gap-[.625rem] items-center">
      <div className="col-span-2">{`Ticket ${ticketNumber}`}</div>
      <div className="col-span-7">
        <HStack
          pos={'apart'}
          className={cn(
            'rounded-md h-[2.125rem] relative z-0',
            'before:border before:border-gray-color before:w-full before:h-full before:absolute before:rounded-md z-10',
            'after:border after:border-primary after:rounded-md after:absolute after:h-full z-20',
            matched === 0 && 'after:hidden',
            matched === 1 && 'after:w-1/4',
            matched === 2 && 'after:w-2/4',
            matched === 3 && 'after:w-3/4',
            matched === 4 && 'after:w-full'
          )}
        >
          {codeSplit.map((codeItem, index) => (
            <div className={cn('flex-1 flex items-center justify-center text-[1.5rem]')} key={index}>
              {codeItem}
            </div>
          ))}

          <p className="absolute top-0 text-primary -translate-y-full">{getMatchedTitle()}</p>
        </HStack>
      </div>
      <div className="col-span-1">
        <Icons.newTab className="text-gray-color" />
      </div>
    </div>
  );
};

export default TicketMatch;
