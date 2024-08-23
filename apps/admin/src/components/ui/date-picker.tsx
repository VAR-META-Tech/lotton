import { useClickOutside } from '@mantine/hooks';
import { format, isValid, parse } from 'date-fns';
import React, { useEffect, useRef } from 'react';
import type { SelectSingleEventHandler } from 'react-day-picker';
import { toast } from 'sonner';

import { Icons } from '@/assets/icons';
import usePopover from '@/hooks/usePopover';
import { isPastDate } from '@/lib/common';
import { cn, convertToDate } from '@/lib/utils';

import { Calendar, type CalendarProps } from './calendar';
import { Input, type InputProps } from './input';
import { CalendarDays } from 'lucide-react';

export interface DatePickerProps extends Omit<InputProps, 'onChange' | 'value'> {
  onChange: (date?: Date) => void;
  value?: Date;
  calendarProps?: CalendarProps;
  label?: string;
  disablePast?: boolean;
  isDisabled?: boolean;
  className?: string;
}
const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    { onChange, value, defaultValue, onBlur, calendarProps, isDisabled, disablePast, label = 'Choose date', className, ...props },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState<string>('');
    const [isOpen, floatingStyles, refs, { open, toggle, close }] = usePopover();
    const popoverRef = useClickOutside(close);
    const isInitialChange = useRef<boolean>(true);

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const allowedKeys = /^[\d/]*$/;
      if (!allowedKeys.test(e.currentTarget.value)) return;
      setInputValue(e.currentTarget.value);
      if (e.currentTarget.value.length < 10) return;
      const date = parse(e.currentTarget.value, 'dd/MM/yyyy', new Date());
      if (isValid(date)) {
        onChange(date);
      } else {
        onChange(undefined);
      }
    };

    const handleSelect: SelectSingleEventHandler = (date) => {
      if (!date) {
        return;
      }
      onChange(date);
      setInputValue(format(date, 'dd/MM/yyyy'));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      const date = parse(e.currentTarget.value, 'dd/MM/yyyy', new Date());
      if (disablePast) {
        if (isPastDate(date)) {
          setInputValue('');
          toast.error('Date value must be in the future');
          onChange(undefined);
          return;
        }
      }

      if (!isValid(date)) {
        setInputValue('');
        onChange(undefined);
      }
    };

    useEffect(() => {
      if (!value) return;

      setInputValue(convertToDate(value));
    }, [value]);

    return (
      <div>
        <div className="relative" ref={refs.setReference}>
          <Input
            {...props}
            label={label}
            suffix={
              <CalendarDays
                className={cn('cursor-pointer', isDisabled && 'pointer-events-none cursor-not-allowed')}
                onClick={toggle}
                size={18}
              />
            }
            ref={ref}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={isDisabled}
            className={className}
          />
        </div>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cn(
              'bg-popover shadow-popover left-0 z-50 min-h-[40px] w-fit overflow-hidden rounded-md outline-none'
            )}
            onClick={open}
          >
            <div ref={popoverRef}>
              <Calendar
                {...calendarProps}
                mode="single"
                selected={value}
                defaultMonth={value}
                onSelect={handleSelect}
                disablePast={disablePast}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
