'use client';

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import CircularProgress from './CircleProgressBar';
import { useRouter, useSearchParams } from 'next/navigation';

const AccordionComponent = ({ title, content }) => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="bg-[#F3F3F3] p-[10px] rounded-[5px]  "
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="h-[44px] px-2">
            <div className="flex items-center gap-[10px] ">
              <CircularProgress progress={27} size={30} />
              <span className="text-sm font-medium text-gray-700 leading-none">
                {title}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {' '}
            <div className="px-2 py-5">{content}</div>{' '}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const DynamicAccordion = ({ items }) => {
  const [openItem, setOpenItem] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accordionId = searchParams.get('section'); // Get the accordionId from the URL
    if (accordionId) {
      setOpenItem(accordionId); // Set the open accordion item based on the search param
    }
  }, [searchParams]);

  const handleValueChange = (value) => {
    setOpenItem(value); // Update the state with the selected accordion item
    if (!value) {
      router.replace('?'); // Clear search params when no item is selected
    } else {
      router.replace(`?section=${value}`); // Update the URL with the selected accordion item
    }
  };
  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-[10px] "
      value={openItem} // Control the open accordion item
      // onValueChange={(value) => setOpenItem(value)} // Update state when accordion changes
      onValueChange={handleValueChange} // Handle manua
    >
      {items.map(({ id, title, content }) => (
        <AccordionItem
          key={id}
          value={id}
          className="border-none bg-[#F3F3F3]  p-[10px] rounded-[5px]"
        >
          <AccordionTrigger className="h-[44px] px-2">
            <div className="flex items-center gap-[16px]">
              {' '}
              {/* Horizontal gap */}
              <CircularProgress progress={27} size={30} />
              <span className="text-sm font-medium text-gray-700 leading-none">
                {title}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-5">{content}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
