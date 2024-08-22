import React from "react";

type Props = {
  startTime: string | null;
  endTime: string | null;
};

export const PoolStatus: React.FC<Props> = ({ startTime, endTime }) => {
  const now = new Date();
  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;

  if (start && start > now) {
    return <span className="text-[#2978D1] text-base font-bold">Up Coming</span>;
  } else if (start && end && start <= now && end >= now) {
    return <span className="text-[#81A95D] text-base font-bold">On Going</span>;
  } else {
    return <span className="text-[#262626] text-base font-bold">Closed</span>;
  }
};
