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
                className="bg-white text-black placeholder:text-gray-400 h-11"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
