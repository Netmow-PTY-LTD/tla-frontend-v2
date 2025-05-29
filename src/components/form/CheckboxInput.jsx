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
import { Checkbox } from '@/components/ui/checkbox';

export default function CheckboxInput({
  name,
  label,
  disabled = false,
  itemClassName = '',
  labelClassName = '',
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={clsx('flex items-center gap-2 space-y-0', itemClassName)}
        >
          <FormControl>
            <Checkbox
              checked={field.value ?? ''}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          {label && (
            <FormLabel className={clsx('font-normal', labelClassName)}>
              {label}
            </FormLabel>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
