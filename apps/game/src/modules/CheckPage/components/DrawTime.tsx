import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

type Props = {
  endTime: number;
};

export const DrawTime = ({ endTime }: Props) => {
  if (!endTime) return null;

  return (
    <motion.div
      key={endTime}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.5 }}
      className="text-sm"
    >
      {endTime && `Draw ${format(new Date(endTime * 1000), 'MMM dd, yyyy, HH:mm a')}`}
    </motion.div>
  );
};
