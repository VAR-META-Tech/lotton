import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Show, VStack } from '@/components/ui/Utilities'
import React, { useMemo } from 'react'
import { Status } from './Status'
import { Button } from '@/components/ui/button'
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import PaginationCus from '@/components/ui/PaginationCus'
import { format } from 'date-fns'
import { convertToTimestamp } from '@/lib/utils'
import { IGetRoundsListResponse } from '@/apis/pool'
import { IGetAllPoolParams } from './types'

type Props = {
  rounds: IGetRoundsListResponse,
  isFetching: boolean,
  handlePageChange: (pageNumber: number) => void,
  paramsQuery: IGetAllPoolParams,
}

const RoundList = ({rounds, isFetching, handlePageChange, paramsQuery}: Props) => {
  const columns = useMemo(
    () => [
      { title: 'No', key: 'index' },
      { title: 'Pool Name', key: 'pool_name' },
      { title: 'Round', key: 'round' },
      { title: 'Start Time', key: 'start_time' },
      { title: 'End Time', key: 'end_time' },
      { title: 'Prize Pool', key: 'prize_pool' },
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
          <Show when={!isFetching && !!rounds?.data?.items}>
            {rounds?.data?.items?.map((round, index) => (
              <TableRow key={round?.id} className="bg-white">
                <TableCell className="text-center border border-[#D4D4D4]">{(rounds?.data?.meta?.currentPage - 1) * 10 + index + 1}</TableCell>
                <TableCell className="text-center border border-[#D4D4D4]">{round?.poolName ?? '-'}</TableCell>
                <TableCell className="text-center border border-[#D4D4D4]">{round?.roundNumber}</TableCell>

                <TableCell className="text-center border border-[#D4D4D4]">
                  {round?.startTime ? format(Number(round?.startTime) * 1000, 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                </TableCell>
                <TableCell className="text-center border border-[#D4D4D4]">
                  {round?.endTime ? format(Number(round?.endTime) * 1000, 'dd-MM-yyyy HH:mm:ss') : 'N/A'}
                </TableCell>

                <TableCell className="text-center border border-[#D4D4D4]">{round?.prizePool ?? '-'} {round?.symbol}</TableCell>

                <TableCell className="text-center border border-[#D4D4D4]">
                  <Status endTime={Number(round?.endTime)} startTime={Number(round?.startTime)} />
                </TableCell>
                
                <TableCell className="text-center border border-[#D4D4D4]">
                  {/* <Link href={`${ROUTES.POOL}/${round.id}`}> */}
                    <Button className='min-w-20 min-h-4 rounded-sm bg-[#1D4ED8]' disabled>
                      View
                    </Button>
                  {/* </Link> */}
                </TableCell>
              </TableRow>
            ))}
          </Show>
        </TableBody>
      </Table>

      {!isFetching && (!rounds?.data?.items || rounds?.data?.items.length === 0) && (
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
        totalCount={rounds?.data?.meta.totalItems || 0}
        currentPage={rounds?.data?.meta.currentPage || 0}
        pageSize={paramsQuery?.pageSizes || 10}
      />
    </div>
  )
}

export default RoundList