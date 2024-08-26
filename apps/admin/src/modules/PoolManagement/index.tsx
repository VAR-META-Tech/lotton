'use client';

import { VStack } from "@/components/ui/Utilities";
import PoolFilter from "./components/Filter";
import { useCallback, useState } from "react";
import { IGetAllPoolParams, PoolSchema } from "./components/types";
import { IGetPoolsListResponse, IGetRoundsListResponse, useGetPools, useGetRounds } from "@/apis/pool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PoolList from './components/PoolList';
import RoundList from './components/RoundList';

const DEFAULT_QUERY = {
  page: 1,
  pageSizes: 10,
};

export const PoolManagement = () => {
  const [paramsQuery, setParamsQuery] = useState<IGetAllPoolParams>(DEFAULT_QUERY);
  const [paramsRoundQuery, setParamsRoundQuery] = useState<IGetAllPoolParams>(DEFAULT_QUERY);
  const [activeTab, setActiveTab] = useState('pools');

  const {
    data: pools,
    isFetching,
    isLoading,
  } = useGetPools(paramsQuery);

  const {
    data: rounds,
    isFetching: isFetchingRounds,
    isLoading: isLoadingRounds,
  } = useGetRounds(paramsRoundQuery);

  const handleSearchChange = useCallback(
    (values: PoolSchema) => {
      (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
        if (activeTab === 'pools') {
          setParamsQuery({
            ...paramsQuery,
            page: 1,
            name: values?.name,
            search: values?.search,
            status: values?.status,
          })
        } else {
          setParamsRoundQuery({
            ...paramsRoundQuery,
            page: 1,
            name: values?.name,
            search: values?.search,
            status: values?.status,
          })
        }
      });
    },
    [paramsQuery, paramsRoundQuery]
  );

  const handleClearValue = () => {
    if (activeTab === 'pools') {
      setParamsQuery(DEFAULT_QUERY);
    } else {
      setParamsRoundQuery(DEFAULT_QUERY);
    }
  }

  const handlePageChange = (pageNumber: number) => {
    if (activeTab === 'pools') {
      setParamsQuery({ ...paramsQuery, page: pageNumber });
    } else {
      setParamsRoundQuery({ ...paramsRoundQuery, page: pageNumber });
    }
  };

  return (
    <VStack className="mx-4 mb-24">
      <PoolFilter
        onSearchChange={handleSearchChange}
        onClearValue={handleClearValue}
        loading={isLoading || isLoadingRounds}
      />

      <div className="min-h-[200px] mt-6 p-6 pb-28 space-y-8 bg-white rounded-sm">
        <Tabs
          defaultValue="pools"
          className="w-full flex justify-center items-center flex-col mx-auto gap-8"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="w-fit flex justify-center items-center">
            <TabsTrigger value="pools" className='w-32 text-[#18191F] data-[state=active]:bg-[#18191F] data-[state=active]:text-white'>Pools</TabsTrigger>
            <TabsTrigger value="rounds" className='w-32 text-[#18191F] data-[state=active]:bg-[#18191F] data-[state=active]:text-white'>Rounds</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className='w-full'>
            <PoolList
              pools={pools as IGetPoolsListResponse}
              handlePageChange={handlePageChange}
              isFetching={isFetching}
              paramsQuery={paramsQuery}
            />
          </TabsContent>

          <TabsContent value="rounds" className='w-full'>
            <RoundList
              rounds={rounds as IGetRoundsListResponse}
              handlePageChange={handlePageChange}
              isFetching={isFetchingRounds}
              paramsQuery={paramsRoundQuery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </VStack>
  );
};
