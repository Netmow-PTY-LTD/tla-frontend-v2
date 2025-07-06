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
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function SelectInput({
  name,
  label,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  triggerClassName = '',
  itemClassName = '',
  labelClassName = '',
  textColor = 'text-black',
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={itemClassName}>
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            <FormControl>
              <Select
                disabled={disabled}
                onValueChange={field.onChange}
                value={field.value ?? ''}
              >
                <SelectTrigger
                  className={clsx(
                    'bg-white h-[44px]',
                    textColor,
                    triggerClassName
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
