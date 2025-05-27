'use client';

import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function TextInput({
  label,
  name,
  value,
  onChange,
  type,
  placeholder,
  control,
  ...props
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleChange = (e) => {
          field.onChange(e);
          if (onChange) {
            onChange(e);
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type={type || 'text'}
                placeholder={placeholder}
                value={field.value || ''}
                onChange={handleChange}
                className="bg-[#f2f2f2] text-black placeholder:text-[#a6a8ab] h-[44px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
