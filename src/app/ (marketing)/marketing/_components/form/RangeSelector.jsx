'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRangeListQuery } from "@/store/features/public/publicApiService";

export default function RangeSelector({ form, name }) {
  const { data: rangeData } = useGetRangeListQuery();
  const ranges = rangeData?.data || [];

  return (
    <div className="w-full">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Range of Area</FormLabel>
            <Select
              onValueChange={(val) => {
                const parsedValue = Number(val); // convert from string to number
                field.onChange(parsedValue); // update form
              }}
              value={field.value !== undefined && field.value !== null ? String(field.value) : ""} // must be string for Select
            >
              <FormControl className="w-full h-[44px]">
                <SelectTrigger style={{ height: "44px" }}>
                  <SelectValue placeholder="Select range of area" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ranges?.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={String(item.value)}
                  >
                    {item?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-red-600" />
          </FormItem>
        )}
      />
    </div>
  );
}
