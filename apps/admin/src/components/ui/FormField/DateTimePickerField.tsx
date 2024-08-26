import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import type { DatePickerProps } from '../date-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { DateTimePicker } from './DateTimePicker';
import { Show } from '../Utilities';

interface Props<T extends FieldValues = FieldValues> extends Omit<DatePickerProps, 'onChange' | 'value'> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  isDisabled?: boolean;
  labelClassName?: string;
}

const DateTimePickerField = <T extends FieldValues>({
  control,
  name,
  label = 'Choose date',
  required,
  className,
  calendarProps,
  disablePast = true,
  isDisabled,
  labelClassName,
  ...props
}: Props<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='flex flex-col gap-1'>
              <Show when={!!label}>
                <FormLabel className={labelClassName}>
                  {label} {required && <span className="text-error-light">*</span>}
                </FormLabel>
              </Show>
              <DateTimePicker
                displayFormat={{ hour24: 'dd/MM/yyyy HH:mm:ss' }}
                className={className}
                {...props}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage className="mt-1 text-xs" />
        </FormItem>
      )}
    />
  );
};

export { DateTimePickerField };
