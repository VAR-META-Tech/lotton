import { HStack, VStack } from '@/components/ui/Utilities';
import { VStackProps } from '@/components/ui/Utilities/v-stack';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface IWinningNumberProps extends VStackProps {
  code?: string;
  titleClassName?: IWinningNumberProps['className'];
}

const WinningNumber: FC<IWinningNumberProps> = ({ code = '    ', titleClassName, className, ...props }) => {
  const codeSplit = code.split('');

  return (
    <VStack className={cn('w-full', className)} spacing={32} {...props}>
      <p className={cn('font-bold', titleClassName)}>WINNING NUMBER</p>

      <HStack spacing={32} pos={'center'}>
        {codeSplit.map((codeItem, index) => (
          <CodeItem code={codeItem} key={index} />
        ))}
      </HStack>
    </VStack>
  );
};

export default WinningNumber;

const CodeItem = ({ code }: { code: string }) => (
  <div className="inline-flex text-[1.625rem] items-center justify-center text-center font-bold w-10 h-10 rounded-full bg-gradient-to-r from-primary to-[#ED9BD6]">
    {code}
  </div>
);
