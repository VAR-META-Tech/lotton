import React from 'react';
import { IOption } from '@/types';
import { motion } from 'framer-motion';

interface TabsProps<T extends string | number> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  layoutId: string;
  data: IOption<T>[];
  value: T;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: T) => void;
}

const Tabs = <T extends string | number>({ layoutId, data, value, onChange, ...props }: TabsProps<T>) => {
  return (
    <div className="flex gap-2 rounded-full border border-gray-color bg-background overflow-hidden" {...props}>
      {data.map((tabItem) => (
        <button
          key={tabItem.value}
          onClick={() => onChange(tabItem.value)}
          className="relative z-0 text-white py-0.5 text-nowrap font-medium flex flex-1 items-center justify-center transition-all"
        >
          {tabItem.label}

          {value === tabItem.value && (
            <motion.div
              layoutId={layoutId}
              className="absolute z-[-1] h-full w-full shadow-md rounded-full bg-primary"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
