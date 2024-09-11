import React from 'react';

export const SkeletonPool = () => {
  return (
    <div className="animate-pulse shadow-lg border w-full relative grid grid-cols-6">
      <div className="bg-background-2 col-span-6 border flex items-center px-4 py-1">
        <div className="bg-slate-200 w-32 rounded-md h-7" />
      </div>

      <div className="inline-flex items-center gap-4 absolute right-4 top-12">
        <span className="w-6 aspect-square bg-slate-200 rounded-md" />
        <span className="w-6 aspect-square bg-slate-200 rounded-md" />
      </div>

      <div className="col-span-6 p-4 flex flex-col items-center gap-4">
        <div className="flex justify-between">
          <div className="inline-flex items-center gap-4">
            <span className="h-6 w-12 bg-slate-200 rounded-md" />

            <span className="w-8 h-8 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="w-full max-w-48 h-[.875rem] bg-slate-200 rounded-md" />

        <div className="w-full max-w-40 h-[.875rem] bg-slate-200 rounded-md" />

        <div className="w-full mx-auto max-w-[147px] rounded-lg h-[2rem] bg-slate-200" />
      </div>
    </div>
  );
};
