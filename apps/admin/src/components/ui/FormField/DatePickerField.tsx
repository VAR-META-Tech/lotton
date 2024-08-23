import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import type { DatePickerProps } from '../date-picker';
import { DatePicker } from '../date-picker';
import { FormControl, FormField, FormItem, FormMessage } from '../form';

interface Props<T extends FieldValues = FieldValues> extends Omit<DatePickerProps, 'onChange' | 'value'> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  isDisabled?: boolean;
}

const DatePickerField = <T extends FieldValues>({
  control,
  name,
  label = 'Choose date',
  required,
  className,
  calendarProps,
  disablePast = true,
  isDisabled,
  ...props
}: Props<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DatePicker
              isDisabled={isDisabled}
              disablePast={disablePast}
              calendarProps={calendarProps}
              className={className}
              {...props}
              {...field}
            />
          </FormControl>
          <FormMessage className="mt-1 text-xs" />
        </FormItem>
      )}
    />
  );
};

export { DatePickerField };
