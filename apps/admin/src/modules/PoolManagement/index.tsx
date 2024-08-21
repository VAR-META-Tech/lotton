'use client';

import { Show, VStack } from "@/components/ui/Utilities";
import PoolFilter from "./components/Filter";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { IGetAllPoolParams, PoolSchema } from "./components/types";

const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
};

export const PoolManagement = () => {
  const [paramsQuery, setParamsQuery] = useState<IGetAllPoolParams>(DEFAULT_QUERY);

  const columns = useMemo(
    () => [
      { title: 'Pool Name', key: 'pool_name' },
      { title: 'Round', key: 'round' },
      { title: 'Start Time', key: 'start_time' },
      { title: 'End Time', key: 'end_time' },
      { title: 'Status', key: 'status' },
      { title: 'Action', key: '' },
    ],
    []
  );

  const handleSearchChange = useCallback(
    (values: PoolSchema) => {
      (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
        setParamsQuery({
          ...paramsQuery,
          page: 1,
          name: values?.name,
          search: values?.search,
          status: values?.status,
        })
      });
    },
    []
  );

  const handleClearValue = () => {
    setParamsQuery(DEFAULT_QUERY);
  }

  return (
    <VStack className="mx-4 mb-24">
      <PoolFilter onSearchChange={handleSearchChange} onClearValue={handleClearValue}/>

      <div className="min-h-[200px] mt-6 p-6 pb-28 bg-white rounded-sm">
        <Table>
          <TableHeader className="!rounded-xl bg-[#D4D4D4] text-[#262626] font-bold">
            <TableRow className="hover:bg-inherit">
              {columns.map((column) => (
                <TableCell className="border border-[#e2e1e1] text-center" key={column.key}>
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <Show when={true}>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index} className="bg-white">
                  <TableCell className="text-center border border-[#D4D4D4]">TON</TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">10/30</TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">01-10-2024 00:00:00</TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">01-10-2024 23:59:59</TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">Up Coming</TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">
                    <Button className='min-w-20 min-h-4 rounded-sm bg-[#1D4ED8]'>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </Show>
          </TableBody>
        </Table>

        {/* {!isFetching && (!admins?.data || admins?.count === 0) && (
          <div className="mt-6 text-center">0 record on the system!!</div>
        )} */}

        {/* <VStack spacing={4}>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonWrapper loading={isFetching} className="h-16 w-full" key={index}>
              <Skeleton />
            </SkeletonWrapper>
          ))}
        </VStack> */}
      </div>
    </VStack>
  );
};
