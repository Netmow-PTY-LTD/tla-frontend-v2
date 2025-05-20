'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import CircularProgress from './CircleProgressBar';

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

export default AccordionComponent;
