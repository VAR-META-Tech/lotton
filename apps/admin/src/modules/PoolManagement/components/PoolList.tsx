import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Show, VStack } from '@/components/ui/Utilities'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { Status } from './Status'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/routes'
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import PaginationCus from '@/components/ui/PaginationCus'
import { format } from 'date-fns'
import { convertToTimestamp } from '@/lib/utils'
import { IGetPoolsListResponse } from '@/apis/pool'
import { IGetAllPoolParams } from './types'

type Props = {
  pools: IGetPoolsListResponse,
  isFetching: boolean,
  handlePageChange: (pageNumber: number) => void,
  paramsQuery: IGetAllPoolParams,
}

const PoolList = ({pools, isFetching, handlePageChange, paramsQuery}: Props) => {
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

  return (
    <div>
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
                  {pool?.startTime ? format(Number(pool?.startTime) * 1000, 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                </TableCell>
                <TableCell className="text-center border border-[#D4D4D4]">
                  {pool?.endTime ? format(Number(pool?.endTime) * 1000, 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                </TableCell>

                <TableCell className="text-center border border-[#D4D4D4]">
                  <Status endTime={Number(pool?.endTime)} startTime={Number(pool?.startTime)} />
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
        pageSize={paramsQuery?.pageSizes || 10}
      />
    </div>
  )
}

export default PoolList