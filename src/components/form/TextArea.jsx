'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaInput({
  name,
  label,
  rows = 4,
  placeholder = '',
  disabled = false,
  textareaClassName = '',
  itemClassName = '',
  labelClassName = '',
  textColor = 'text-black',
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className={clsx(
                'bg-white border-[#DCE2EA] placeholder:text-[#a6a8ab] w-full ',
                textColor,
                textareaClassName
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
