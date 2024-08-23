import React from 'react';

export const SkeletonPool = () => {
  return (
    <div className="animate-pulse shadow-lg border w-full max-w-lg grid grid-cols-6 h-[8.125rem]">
      <div className="bg-background-2 col-span-2 border flex items-center justify-center">
        <div className="bg-slate-200 w-[5.1875rem] rounded-md h-8" />
      </div>

      <div className="col-span-4 p-4 flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="inline-flex items-center gap-4">
            <span className="h-4 w-[3.25rem] bg-slate-200 rounded-md" />

            <span className="w-[2.9375rem] h-[1.75rem] bg-slate-200 rounded-md" />
          </div>
          <div className="inline-flex items-center gap-4">
            <span className="w-6 aspect-square bg-slate-200 rounded-md" />
            <span className="w-6 aspect-square bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="w-full max-w-md h-[.875rem] bg-slate-200 rounded-md" />

        <div className="w-full mx-auto max-w-[147px] rounded-lg h-[2rem] bg-slate-200" />
      </div>
    </div>
  );
};
