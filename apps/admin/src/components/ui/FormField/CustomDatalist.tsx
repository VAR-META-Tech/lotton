import React, { useState, useRef, useEffect } from 'react';
import { Input, InputProps } from '../input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Show } from '../Utilities';
import { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface DataItem {
  value: string;
  label: string;
}

// interface CustomDatalistProps {
//   data: DataItem[];
// }

interface Props<T extends FieldValues = FieldValues> extends InputProps {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  containerClassName?: string;
  requiredClassName?: string;
  data: DataItem[];
}

const CustomDatalist = <T extends FieldValues>({
  data,
  className,
  labelClassName,
  control,
  defaultValue,
  label,
  required,
  containerClassName,
  requiredClassName,
  ...props
}: Props<T>) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    props.onChange?.(e);
  };

  const handleOptionClick = (option: DataItem) => {
    setInputValue(option.label);
    setShowDropdown(false);
    props.onChange?.({ target: { value: option.label } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log(inputValue);

  return (
    <>
      <FormField
        defaultValue={defaultValue}
        control={control}
        name={props.name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className={cn(containerClassName)}>
                <Show when={!!label}>
                  <FormLabel className={labelClassName}>
                    {label} {required && <span className={cn('text-error-light', requiredClassName)}>*</span>}
                  </FormLabel>
                </Show>
                <div className="relative" ref={inputRef}>
                  <Input
                    {...props}
                    {...field}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    className={cn("p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500", className)}
                    placeholder="Type or select an option"
                  />
                  {showDropdown && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {data
                        // .filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((item) => (
                          <li
                            key={item.value}
                            onClick={() => handleOptionClick(item)}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {item.label}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <FormMessage className="mt-1 text-xs" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default CustomDatalist;
