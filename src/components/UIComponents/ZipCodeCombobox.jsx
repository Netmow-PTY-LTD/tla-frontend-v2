'use client';

import React from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

export default function ZipCodeCombobox({ data = [], onChange }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleSelect = (zipcode) => {
    setValue(zipcode);
    setOpen(false);
    onChange?.(zipcode);
  };

  return (
    <div className="flex flex-col gap-2 mt-8">
      <span className="text-sm font-medium">Enter Your ZIP Code</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-[44px]"
          >
            {value ? value : 'Search ZIP Code...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 z-[9999]" // ensure it's above modal
          forceMount // ✅ make sure it stays mounted
          onInteractOutside={(e) => {
            if (e.target.closest('[cmdk-root]')) {
              e.preventDefault(); // ✅ prevent closing when clicking in options
            }
          }}
        >
          <Command>
            <CommandInput
              placeholder="Search ZIP Code..."
              className="h-[44px]"
            />
            <CommandList>
              <CommandEmpty>No ZIP codes found.</CommandEmpty>
              <CommandGroup>
                {data?.map((zip) => (
                  <CommandItem
                    key={zip._id}
                    value={zip.zipcode}
                    onSelect={(zipcode) => {
                      setValue(zipcode);
                      setOpen(false);
                      onChange?.(zipcode);
                    }}
                  >
                    {zip.zipcode}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === zip.zipcode ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
