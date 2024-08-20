import React from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import type { InputProps } from '../input';
import { Input } from '../input';
import { Show } from '../Utilities';

interface Props<T extends FieldValues = FieldValues> extends InputProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  labelClassName?: string;
  required?: boolean;
}

const NumberField = <T extends FieldValues>({
  className,
  labelClassName,
  control,
  defaultValue,
  label,
  required,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div>
              <Show when={!!label}>
                <FormLabel className={labelClassName}>
                  {label} {required && <span className="text-error-light">*</span>}
                </FormLabel>
              </Show>
              <Input
                type="number"
                {...field}
                {...props}
                formNoValidate
                className={className}
                onChange={(e) => {
                  field.onChange(e.target.value ? +e.target.value : '');
                }}
              />
              <FormMessage className="mt-1 text-xs" />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { NumberField };
