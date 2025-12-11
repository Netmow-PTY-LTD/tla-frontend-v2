'use client';

import { Badge } from '@/components/ui/badge';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React from 'react';

import { useFormContext } from 'react-hook-form';



export default function ServiceSelector({ name, services, hasError }) {
  const { watch, setValue } = useFormContext();
  const selectedServices = watch(name) || [];

  const toggleService = (id) => {
    const isSelected = selectedServices.includes(id);
    if (isSelected) {
      setValue(name, selectedServices.filter((s) => s !== id));
    } else {
      setValue(name, [...selectedServices, id]);
    }
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel>Popular Services</FormLabel>

      <div className="flex flex-wrap gap-2">
        {services.map((s) => {
          const isSelected = selectedServices.includes(s._id);
          return (
            <Badge
              key={s._id}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => toggleService(s._id)}
              className="cursor-pointer py-1 px-3 text-sm flex items-center gap-1 hover:scale-105 transition-all duration-150"
            >
              {s.name} {isSelected && <span className="text-xs">✕</span>}
            </Badge>
          );
        })}
      </div>

      {hasError && <FormMessage>At least one service must be selected.</FormMessage>}
    </FormItem>
  );
}
