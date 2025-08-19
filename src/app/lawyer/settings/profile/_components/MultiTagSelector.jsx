'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useController, useFormContext } from 'react-hook-form';

const languages = [
  'English',
  'Arabic',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
];

export default function MultiTagSelector({ name }) {
  const [open, setOpen] = useState(false);

  const { control ,   formState: { errors },} = useFormContext();
  const {
    field: { value = [], onChange },
    
  } = useController({ name, control });

  const toggleTag = (tag) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-3 w-full mb-7">
      {/* Selected tags as badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="flex items-center gap-1"
            >
              {tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Popover with Command */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" 
           className={cn(
              'w-full justify-start h-[44px]',
              errors[name] ? 'border-red-500' : ''
            )}

          >
            Select Language
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandGroup>
              {languages.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => toggleTag(tag)}
                  className={cn(
                    'cursor-pointer',
                    value.includes(tag) ? 'bg-muted' : ''
                  )}
                >
                  {value.includes(tag) ? '✅ ' : ''}
                  {tag}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
       {/* Error message */}
      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message }
        </p>
      )}
    </div>
  );
}
