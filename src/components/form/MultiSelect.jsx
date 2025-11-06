'use client';

import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Reusable MultiSelect component
 *
 * @param {Array} options - [{ label: string, value: string }]
 * @param {Array} value - array of selected values (string[])
 * @param {Function} onChange - handler called with updated array
 * @param {string} placeholder - placeholder text
 * @param {string} className - optional custom class
 */

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  className,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // filter list
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // toggle option
  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'min-h-[2.5rem] justify-between text-left w-full',
            value.length > 0 ? 'h-auto py-2' : 'h-10',
            className
          )}
        >
          <div className="flex flex-wrap items-center gap-1 flex-1 overflow-visible">
            {value.length > 0 ? (
              value.map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1.5 py-1.5"
                  >
                    {opt?.label}
                    <X
                      className="h-2.5 w-2.5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(val);
                      }}
                    />
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground truncate">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[280px]">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea className="max-h-60">
              <CommandGroup>
                {filteredOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => toggleOption(opt.value)}
                    className="gap-1 cursor-pointer"
                  >
                    {value.includes(opt.value) ? (
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.includes(opt.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    ) : (
                      ''
                    )}

                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
