import { format } from 'date-fns';

type Props = {
  endTime: number;
};

export const DrawTime = ({ endTime }: Props) => {
  if (!endTime) return null;

  return (
    <div className="text-sm">{endTime && `End at ${format(new Date(endTime * 1000), 'MMM dd, yyyy, HH:mm a')}`}</div>
  );
};
