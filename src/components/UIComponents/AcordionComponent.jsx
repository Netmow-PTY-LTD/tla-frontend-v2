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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 leading-none">
                {title}
              </span>
              <CircularProgress progress={27} size={30} />
            </div>
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionComponent;
