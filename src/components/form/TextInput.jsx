'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx'; // for conditional class merging
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function TextInput({
  name,
  label,
  placeholder = '',
  type = 'text',
  disabled = false,
  inputClassName = '',
  itemClassName = '',
  labelClassName = '',
  ...props
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { ref, value, onChange, onBlur, name, ...restField } = field;

        return (
          <FormItem className={itemClassName}>
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            <FormControl>
              <Input
                {...restField}
                name={name}
                ref={ref}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                value={value ?? ''}
                className={clsx(
                  'bg-white border-[#DCE2EA] text-black placeholder:text-[#a6a8ab] h-[44px]',
                  inputClassName
                )}
                {...props}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
