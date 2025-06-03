'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const ServiceCard = ({
  id = 'default-id',
  title,
  subtitle,
  description = 'All leads · 1 location',
  question = 'Which of these best describes you?',
  options = [],
  defaultSelectedOptions = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState(
    defaultSelectedOptions
  );

  const handleOptionChange = (option, checked) => {
    setSelectedOptions((prev) =>
      checked ? [...prev, option] : prev.filter((opt) => opt !== option)
    );
  };

  return (
    <AccordionItem value={title} className="border-b bg-white border-gray-200">
      <AccordionTrigger className="py-4 px-4 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`${id}-question`} className="border-none">
              <AccordionTrigger className="py-4 px-0">
                <h4 className="text-base font-semibold text-gray-900">
                  {question}
                </h4>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  {options.map((option) => (
                    <div key={option} className="flex items-center space-x-3">
                      <Checkbox
                        id={`${id}-${option}`}
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={(checked) =>
                          handleOptionChange(option, checked)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${option}`}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ServiceCard;
