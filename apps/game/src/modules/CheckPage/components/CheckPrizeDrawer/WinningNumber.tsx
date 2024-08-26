import { HStack, VStack } from '@/components/ui/Utilities';
import { FC } from 'react';

interface IWinningNumberProps {
  code?: string;
}

const WinningNumber: FC<IWinningNumberProps> = ({ code = '    ' }) => {
  const codeSplit = code.split('');
  return (
    <VStack className="container p-4 py-8" spacing={32}>
      <p className="font-bold">WINNING NUMBER</p>

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
  <div className="inline-flex text-[1.625rem] items-center justify-center text-center font-bold w-[2.1875rem] aspect-square rounded-full bg-gradient-to-r from-primary to-[#ED9BD6]">
    {code}
  </div>
);
