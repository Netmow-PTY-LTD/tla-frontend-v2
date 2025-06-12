'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMemo, useState } from 'react';
import LeadServiceAction from './LeadServiceAction';
import { useLeadServiceSelectedOptionsUpdateMutation } from '@/store/features/leadService/leadServiceApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const ServiceCard = ({
  leadServiceId,
  title = 'Default Service Title',
  service,
  serviceLocations,
}) => {
  const [selectedOptionsUpdate] = useLeadServiceSelectedOptionsUpdateMutation();

  // console.log('serviceLocations', serviceLocations);
  // const [selectedLocationIds, setSelectedLocationIds] = useState(
  //   serviceLocations?.map((loc) => loc._id)
  // );

  // const [selectedLocationIds, setSelectedLocationIds] = useState(() =>
  //   serviceLocations
  //     .filter((loc) => loc.SelectedLocationId === loc.SelectedLocationId)
  //     .map((loc) => loc._id)
  // );
  /* 

initial state data for question wise options 

*/
  const questions = service || [];

  // Initialize selected options grouped by questionId
  const initializeSelected = () => {
    const initial = {};
    questions.forEach((q) => {
      initial[q._id] = q.selectedOptionIds || [];
    });
    return initial;
  };

  // Detect if selectedOptions have changed from the initial

  const [selectedOptions, setSelectedOptions] = useState(initializeSelected());

  const initialSelectedOptions = initializeSelected();
  /* 
initial locations data 


*/

  // Detect if selectedOptions have changed from the initial
  const isDirty =
    JSON.stringify(selectedOptions) !== JSON.stringify(initialSelectedOptions);

  // // Detect if locations have changed

  const initialLocationIds = () => {
    return serviceLocations;
  };

  const [selectedLocationIds, setSelectedLocationIds] =
    useState(serviceLocations);

  console.log('selectedLocationIds', selectedLocationIds);
  console.log('initialLocationIds', initialLocationIds());

  const deepEqual = (a, b) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    return a.every((objA, i) => {
      const objB = b[i];
      return (
        objA._id === objB._id &&
        objA.locationType === objB.locationType &&
        JSON.stringify(objA.serviceIds) === JSON.stringify(objB.serviceIds)
      );
    });
  };

  const isDirtyLocation = !deepEqual(selectedLocationIds, initialLocationIds());

  const handleOptionChange = (questionId, optionId, checked) => {
    setSelectedOptions((prev) => {
      const prevOptions = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: checked
          ? [...new Set([...prevOptions, optionId])]
          : prevOptions.filter((id) => id !== optionId),
      };
    });
  };

  const handleSubmit = async () => {
    const answers = Object.entries(selectedOptions).map(
      ([questionId, selectedOptionIds]) => ({
        questionId,
        selectedOptionIds,
      })
    );

    const payload = {
      answers,
      selectedLocationIds: selectedLocationIds,
    };

    try {
      const response = await selectedOptionsUpdate({
        leadServiceId,
        answers: payload,
      }).unwrap();

      if (response.success) {
        showSuccessToast(
          response?.message || 'selected option update successfully'
        );
      } else {
        showErrorToast('Failed to selected option');
      }
    } catch (error) {
      console.error('Update failed:', error);
      const errorMessage =
        error?.data?.message || 'An error occurred while selected option';
      showErrorToast(errorMessage);
    }
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
                          checked={
                            selectedOptions[q._id]?.includes(option._id) ||
                            false
                          }
                          onCheckedChange={(checked) =>
                            handleOptionChange(q._id, option._id, checked)
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
            <LeadServiceAction
              leadServiceId={leadServiceId}
              onSubmit={handleSubmit}
              isDirty={isDirty}
              serviceLocations={serviceLocations}
              selectedLocationIds={selectedLocationIds}
              setSelectedLocationIds={setSelectedLocationIds}
              isDirtyLocation={isDirtyLocation}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ServiceCard;
