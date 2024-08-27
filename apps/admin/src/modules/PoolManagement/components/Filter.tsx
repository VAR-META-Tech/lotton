import { type FC } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { POOL_STATUS } from '@/lib/const';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { SelectField, TextField } from '@/components/ui/FormField';
import FormWrapper from '@/components/ui/FormWrapper';
import { HStack, VStack } from '@/components/ui/Utilities';

import { poolFilterSchema, PoolFilterSchema } from './types';

interface Props {
  loading?: boolean;
  onSearchChange: (valuesSearch: PoolFilterSchema) => void;
  onClearValue?: () => void;
}

const PoolFilter: FC<Props> = ({ onSearchChange, loading, onClearValue }) => {
  const methods = useForm<PoolFilterSchema>({
    resolver: zodResolver(poolFilterSchema),
    defaultValues: {
      // name: 'all',
      status: 'all',
      search: ''
    }
  });

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Up Coming', value: POOL_STATUS.UP_COMING },
    { label: 'On Going', value: POOL_STATUS.ON_GOING },
    { label: 'Closed', value: POOL_STATUS.CLOSED },
  ];

  const handleSearch: SubmitHandler<PoolFilterSchema> = (values) => {
    onSearchChange({
      // name: values.name,
      status: values.status === 'all' ? undefined : values.status,
      search: values.search,
    });
  };

  const handleClearFilter = () => {
    methods.reset({
      status: 'all',
      // name: 'all',
      search: '',
    });

    onClearValue?.();
  };

  return (
    <div className="space-y-4 px-6 bg-white py-8 rounded-sm">
      <FormWrapper methods={methods} onSubmit={handleSearch}>
        <VStack>
          <div className="w-[100%] lg:w-[70%] grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <SelectField
                data={statusOptions}
                control={methods.control}
                fullWidth
                name="status"
                label="Status"
                className="border border-[#8B8B94] h-[3rem] rounded-sm"
              />
            </div>

            {/* <div>
              <SelectField
                data={StatusOptions}
                control={methods.control}
                fullWidth
                name="name"
                label="Pool Name"
                className="border border-[#8B8B94] h-[3rem] rounded-sm"
              />
            </div> */}

            <div>
              <TextField
                control={methods.control}
                name="search"
                label="Search"
                placeholder="Enter keyword..."
                suffix={<Search className="text-[#8B8B94]" />}
                className="border border-[#8B8B94] h-[3rem]"
              />
            </div>
          </div>

          <hr />

          <HStack className="w-full justify-between gap-6">
            <HStack spacing={20}>
              <Button type="submit" loading={loading} className="min-w-32 min-h-8 rounded-sm">
                Apply Filter
              </Button>

              <Button
                type="button"
                variant="outline"
                className="min-w-32 min-h-8 rounded-sm border border-[#262626]"
                onClick={handleClearFilter}
              >
                Clear Filter
              </Button>
            </HStack>

            <Link href={ROUTES.POOL_CREATE}>
              <Button className="min-w-32 min-h-8 rounded-sm bg-gradient-to-r from-[#FFBF00] to-[#ED9BD6]">
                Create Pool
              </Button>
            </Link>
          </HStack>
        </VStack>
      </FormWrapper>
    </div>
  );
};

export default PoolFilter;
