import React, { useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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
import { HStack, VStack } from '@/components/ui/Utilities';

import TextWrap from './TextWrap';

const WinningSection = () => {
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

  return (
    <VStack>
      <HStack className="mb-12">
        <VStack className="flex-1">
          <div className="flex flex-col gap-2 justify-center items-start">
            <p className="text-md">Winning Ticket Block</p>
            <div className="bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] p-[.625rem] flex items-center whitespace-nowrap gap-3">
              <p className="font-sm">6771975b6b26718....0a5fc4fbf770298cb25b2a5</p>
              <Link href={'/'}>
                <ExternalLink className="text-[#8B8B94]" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-start">
            <p className="text-md">Total Winning Amount</p>
            <div className="bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] p-[.625rem] flex items-center whitespace-nowrap gap-3">
              <p className="font-sm">110.000 TON</p>
            </div>
          </div>
        </VStack>

        <div className="flex-1 min-h-[4.75rem] shadow-shadowCustom bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] justify-around p-[.625rem] flex items-center whitespace-nowrap">
          <p className="font-sm">Winning Number</p>

          <HStack spacing={12}>
            <TextWrap text={'b'} />
            <TextWrap text={'2'} />
            <TextWrap text={'a'} />
            <TextWrap text={'5'} />
          </HStack>
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
          {Array.from({ length: 4 }, (_, i) => (
            <TableRow className="bg-white">
              <TableCell className="text-center border border-[#D4D4D4]">Match first {i + 1}</TableCell>
              <TableCell className="text-center border border-[#D4D4D4]"></TableCell>

              <TableCell className="text-center border border-[#D4D4D4]"></TableCell>
              <TableCell className="text-center border border-[#D4D4D4]"></TableCell>

              <TableCell className="text-center border border-[#D4D4D4]"></TableCell>

              <TableCell className="text-center border border-[#D4D4D4]">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="min-w-20 min-h-4 rounded-sm bg-[#1D4ED8]">View</Button>
                  </DialogTrigger>

                  <DialogContent className="!rounded-sm">
                    <DialogHeader>
                      <DialogTitle className="text-center text-md leading-8 font-extrabold">WINNING NUMBER</DialogTitle>
                      <DialogDescription className="!my-8 space-y-8">
                        <HStack spacing={12} className="justify-center ">
                          <TextWrap text={'b'} />
                          <TextWrap text={'2'} />
                          <TextWrap text={'a'} />
                          <TextWrap text={'5'} />
                        </HStack>

                        <div className="w-full h-[.0625rem] bg-[#8B8B94]"></div>

                        <VStack>
                          <p className="font-bold text-md text-black">MATCHED FIRST 2</p>
                        </VStack>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}

          <TableRow className="!bg-[#D4D4D4] hover:bg-inherit">
            <TableCell className="text-center border border-[#e2e1e1]"></TableCell>
            <TableCell className="text-center border border-[#e2e1e1]"></TableCell>

            <TableCell className="text-center border border-[#e2e1e1]">-</TableCell>
            <TableCell className="text-center border border-[#e2e1e1]">-</TableCell>

            <TableCell className="text-center border border-[#e2e1e1]">-</TableCell>

            <TableCell className="text-center border border-[#e2e1e1]"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </VStack>
  );
};

export default WinningSection;
