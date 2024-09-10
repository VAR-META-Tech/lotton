import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IGetRoundDetail, useGetRoundWinningTicket } from '@/apis/pool';
import { ExternalLink } from 'lucide-react';

import { formatPrize, shortenAddress } from '@/lib/common';
import { BIG_NUMBER, tonScanAddress } from '@/lib/const';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { HStack, VStack } from '@/components/ui/Utilities';

import MatchBox from './MatchBox';
import TextWrap from './TextWrap';

type Props = {
  round?: IGetRoundDetail;
};

const WinningSection = ({ round }: Props) => {
  const columns = useMemo(
    () => [
      { title: 'Match First', key: 'match_first' },
      { title: '% Prize', key: 'prize' },
      { title: 'Amount', key: 'amount' },
      { title: 'Winning Tickets', key: 'winning_tickets' },
      { title: 'Amount/Ticket', key: 'amount_per_ticket' },
      { title: 'Action', key: '' },
    ],
    []
  );
  const { id } = useParams();
  const [matchNumber, setMatchNumber] = useState<number | null>(null);
  const defaultParams = {
    roundId: Number(id),
    matchNumber: Number(matchNumber),
    page: 1,
    pageSizes: BIG_NUMBER,
  };
  const [paramsQuery, setParamsQuery] = useState(defaultParams);

  const { data: winningTicket } = useGetRoundWinningTicket(paramsQuery, {
    queryKey: ['/rounds/winningTicket', paramsQuery],
    enabled: !!paramsQuery.roundId && !!paramsQuery.matchNumber,
  });

  const totalAmountPerTicket = round?.matchs
    ?.filter((match) => match.amountPerTicket !== null)
    .reduce((total, match) => total + Number(match.amountPerTicket), 0);

  const handleView = (match: number) => {
    if (matchNumber !== null) {
      setMatchNumber(null);
    } else {
      setMatchNumber(match);
    }
  };

  useEffect(() => {
    setParamsQuery({
      ...paramsQuery,
      matchNumber: Number(matchNumber),
    });
  }, [matchNumber]);

  return (
    <VStack>
      <HStack className="mb-12">
        <VStack className="flex-1">
          <div className="flex flex-col gap-2 justify-center items-start">
            <p className="text-md">Winning Ticket Block</p>
            <div className="bg-[#ECEEF1] border border-[#8B8B94] w-[26.3125rem] rounded-[.1875rem] p-[.625rem] whitespace-nowrap gap-3">
              {round?.winningBlock ? (
                <Link href={`${tonScanAddress}/tx/${round?.winningBlock}`} rel="noopener noreferrer" target="_blank">
                  <Tooltip label={round?.winningBlock}>
                    <HStack className="flex-nowrap hover:underline" spacing={12}>
                      <p>{shortenAddress(round?.winningBlock, 30)}</p>
                      <ExternalLink className="text-[#8B8B94]" />
                    </HStack>
                  </Tooltip>
                </Link>
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-start">
            <p className="text-md">Total Winning Amount</p>
            <div className="bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] p-[.625rem] flex items-center whitespace-nowrap gap-3">
              <p className="font-sm">
                {formatPrize(Number(round?.totalWinningPrizes), Number(9)) ?? ''} {round?.tokenSymbol || ''}
              </p>
            </div>
          </div>
        </VStack>

        <div
          className={cn(
            'flex-1 min-h-[4.75rem] shadow-shadowCustom bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] p-[.625rem] flex items-center whitespace-nowrap',
            round?.winningCode ? 'justify-around' : 'justify-center'
          )}
        >
          <p className="font-sm">Winning Number</p>

          <HStack spacing={12}>{round?.winningCode.split('').map((item) => <TextWrap text={item} />)}</HStack>
        </div>
      </HStack>

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
          {round?.matchs?.map((r, i) => (
            <TableRow className="bg-white">
              <TableCell className="text-center border border-[#D4D4D4]">Match first {r.matchNumber}</TableCell>
              <TableCell className="text-center border border-[#D4D4D4]">{r.allocation}%</TableCell>

              <TableCell className="text-center border border-[#D4D4D4]">
                {formatPrize(Number(r.amount), Number(r.tokenDecimals))} {r.tokenName}
              </TableCell>
              <TableCell className="text-center border border-[#D4D4D4]">{r.winningTickets}</TableCell>

              <TableCell className="text-center border border-[#D4D4D4]">
                {formatPrize(Number(r.amountPerTicket), Number(r.tokenDecimals))} {r.tokenName}
              </TableCell>

              <TableCell className="text-center border border-[#D4D4D4]">
                <Dialog onOpenChange={() => handleView(r.matchNumber)}>
                  <DialogTrigger asChild>
                    <Button className="min-w-20 min-h-4 rounded-sm bg-[#1D4ED8]">View</Button>
                  </DialogTrigger>

                  <DialogContent className="!rounded-sm">
                    <DialogHeader>
                      <DialogTitle className="text-center text-md leading-8 font-extrabold">WINNING NUMBER</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="space-y-8">
                      <HStack spacing={12} className="justify-center ">
                        {round?.winningCode.split('').map((item) => <TextWrap text={item} />)}
                      </HStack>

                      <div className="w-full h-[.0625rem] bg-[#8B8B94]"></div>

                      <VStack className="max-h-[50vh] !overflow-auto pb-8">
                        <p className="font-bold text-md text-black">MATCHED FIRST {r.matchNumber}</p>

                        {!!winningTicket?.data?.items && winningTicket?.data?.items?.length > 0 ? (
                          winningTicket?.data?.items?.map((ticket, index) => (
                            <MatchBox
                              matchNum={ticket?.winningMatch}
                              ticket={ticket?.ticketCode}
                              index={index + 1}
                            />
                          ))
                        ) : (
                          <div className="mt-6 text-center">0 record on the system!!</div>
                        )}
                      </VStack>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}

          <TableRow className="!bg-[#D4D4D4] hover:bg-inherit">
            <TableCell className="text-center border border-[#e2e1e1]"></TableCell>
            <TableCell className="text-center border border-[#e2e1e1]"></TableCell>

            <TableCell className="text-center border border-[#e2e1e1]">
              {formatPrize(Number(round?.totalPrizes), Number(round?.tokenDecimals)) ?? '-'} {round?.tokenName}
            </TableCell>
            <TableCell className="text-center border border-[#e2e1e1]">
              {round?.winningTickets ?? '-'} {Number(round?.winningTickets) ? 'ticket(s)' : ''}
            </TableCell>

            <TableCell className="text-center border border-[#e2e1e1]">
              {formatPrize(Number(totalAmountPerTicket), Number(round?.tokenDecimals))} {round?.tokenName}
            </TableCell>

            <TableCell className="text-center border border-[#e2e1e1]"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </VStack>
  );
};

export default WinningSection;
