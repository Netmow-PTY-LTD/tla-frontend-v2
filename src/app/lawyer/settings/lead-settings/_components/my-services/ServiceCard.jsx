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
import LeadServiceAction from './LeadServiceAction';

const ServiceCard = ({
  leadServiceId,
  title = 'Default Service Title',
  service,
}) => {
  const questions = service?.questions || [];
  const defaultSelectedOptions = service?.defaultSelectedOptions || [];

  const [selectedOptions, setSelectedOptions] = useState(
    defaultSelectedOptions
  );

  const handleOptionChange = (optionId, checked) => {
    setSelectedOptions((prev) =>
      checked ? [...prev, optionId] : prev.filter((opt) => opt !== optionId)
    );
  };

  return (
    <AccordionItem
      value={`service-${leadServiceId}`}
      className="border-b bg-white border-gray-200   "
    >
      <AccordionTrigger className="py-4 px-4 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-base font-medium text-gray-800">{title}</h3>

          <div className="text-sm text-gray-500 mt-2">
            <span className="font-medium">All leads </span>
            <span className=" mx-2 w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
            <span className="font-medium"> 1 location </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 w-full">
        <div className="space-y-4">
          <Accordion
            type="multiple"
            collapsible
            className="max-w-[85%] mx-auto"
          >
            {questions.map((q, index) => (
              <AccordionItem
                key={q._id}
                value={`question-${q._id}`}
                className="border-none"
              >
                <AccordionTrigger className="py-4 px-0">
                  <h4 className="text-base font-semibold text-gray-900 flex items-center">
                    <span className="mr-2 w-5 h-5 flex items-center justify-center bg-slate-300 text-xs font-medium rounded-full text-gray-800">
                      {index + 1}
                    </span>
                    {q.question}
                  </h4>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2 px-8">
                    {q.options.map((option) => (
                      <div
                        key={option._id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`${option._id}`}
                          checked={selectedOptions.includes(option._id)}
                          onCheckedChange={(checked) =>
                            handleOptionChange(option._id, checked)
                          }
                        />
                        <Label
                          htmlFor={`${option._id}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {option.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="max-w-[85%] mx-auto">
            <LeadServiceAction leadServiceId={leadServiceId} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ServiceCard;
