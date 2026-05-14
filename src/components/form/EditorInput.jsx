'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import EditorField from '@/components/inleads-editor/EditorField';

export default function EditorInput({
  name,
  label,
  placeholder = '',
  height = 200,
  required = false,
  itemClassName = '',
  labelClassName = '',
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
            <EditorField
              name={name}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              height={height}
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
