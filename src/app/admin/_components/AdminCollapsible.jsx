'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function AdminCollapsible({ item, option }) {
  console.log('selected option', item);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          {item?.length ?? 0} selected options
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {item?.length > 0 &&
          item?.map((option, i) => (
            <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
              {option?.name}
            </div>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
