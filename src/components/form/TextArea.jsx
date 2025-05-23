import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  control,
  ...props
}) {
  return (
    <>
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
                <Textarea
                  rows={6}
                  placeholder={placeholder}
                  {...field}
                  className="bg-white text-black placeholder:text-gray-400"
                  value={value || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
