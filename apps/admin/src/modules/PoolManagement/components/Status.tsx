import React from "react";

type Props = {
  startTime: number | null;
  endTime: number | null;
};

export const Status: React.FC<Props> = ({ startTime, endTime }) => {
  const now = new Date().getTime();
  const start = startTime ? Number(startTime) * 1000 : null;
  const end = endTime ? Number(endTime) * 1000 : null;

  if (start && start > now) {
    return <span className="text-[#2978D1] text-base font-bold">Up Coming</span>;
  } else if (start && end && start <= now && end >= now) {
    return <span className="text-[#81A95D] text-base font-bold">On Going</span>;
  } else {
    return <span className="text-[#262626] text-base font-bold">Closed</span>;
  }
};
