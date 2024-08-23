'use client';

import { format } from 'date-fns';
import { Show, VStack } from "@/components/ui/Utilities";
import PoolFilter from "./components/Filter";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { IGetAllPoolParams, PoolSchema } from "./components/types";
import { useGetPools } from "@/apis/pool";
import { convertToTimestamp } from '@/lib/utils';
import PaginationCus from '@/components/ui/PaginationCus';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { PoolStatus } from './components/getPoolStatus';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
};

export const PoolManagement = () => {
  const [paramsQuery, setParamsQuery] = useState<IGetAllPoolParams>(DEFAULT_QUERY);
  const {
    data: pools,
    isFetching,
    isLoading,
  } = useGetPools(paramsQuery);

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
    [paramsQuery]
  );

  const handleClearValue = () => {
    setParamsQuery(DEFAULT_QUERY);
  }

  const handlePageChange = (pageNumber: number) => {
    setParamsQuery({ ...paramsQuery, page: pageNumber });
  };

  return (
    <VStack className="mx-4 mb-24">
      <PoolFilter
        onSearchChange={handleSearchChange}
        onClearValue={handleClearValue}
        loading={isLoading}
      />

      <div className="min-h-[200px] mt-6 p-6 pb-28 space-y-8 bg-white rounded-sm">
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
            <Show when={!isFetching && !!pools?.data?.items}>
              {pools?.data?.items?.map((pool, index) => (
                <TableRow key={pool?.id} className="bg-white">
                  <TableCell className="text-center border border-[#D4D4D4]">{pool?.name}</TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">{pool?.totalRounds}</TableCell>

                  <TableCell className="text-center border border-[#D4D4D4]">
                    {pool?.startTime ? format(convertToTimestamp(pool?.startTime), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-center border border-[#D4D4D4]">
                    {pool?.endTime ? format(convertToTimestamp(pool?.endTime), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                  </TableCell>

                  <TableCell className="text-center border border-[#D4D4D4]">
                    <PoolStatus endTime={pool?.endTime} startTime={pool?.startTime} />
                  </TableCell>
                  
                  <TableCell className="text-center border border-[#D4D4D4]">
                    <Link href={`${ROUTES.POOL}/${pool.id}`}>
                      <Button className='min-w-20 min-h-4 rounded-sm bg-[#1D4ED8]'>
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </Show>
          </TableBody>
        </Table>

        {!isFetching && (!pools?.data?.items || pools?.data?.items.length === 0) && (
          <div className="mt-6 text-center">0 record on the system!!</div>
        )}

        <VStack spacing={4} className='!my-1'>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonWrapper loading={isFetching} className="h-16 w-full" key={index}>
              <Skeleton />
            </SkeletonWrapper>
          ))}
        </VStack>

        <PaginationCus
          onPageChange={handlePageChange}
          totalCount={pools?.data?.meta.totalItems || 0}
          currentPage={pools?.data?.meta.currentPage || 0}
          pageSize={paramsQuery?.limit || 10}
        />
      </div>
    </VStack>
  );
};
