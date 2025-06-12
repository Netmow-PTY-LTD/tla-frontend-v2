// 'use client';

// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from '@/components/ui/accordion';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { useState } from 'react';
// import { useLeadServiceSelectedOptionsUpdateMutation } from '@/store/features/leadService/leadServiceApiService';
// import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
// import LeadServiceAction from './LeadServiceAction';

// const ServiceCard = ({
//   leadServiceId,
//   title = 'Default Service Title',
//   questions = [],
//   serviceLocations = [],
// }) => {
//   const [selectedOptionsUpdate] = useLeadServiceSelectedOptionsUpdateMutation();

//   const initializeSelected = () => {
//     const initial = {};
//     questions.forEach((q) => {
//       const questionId = q?.question?._id;
//       if (questionId) {
//         const selectedOptionIds = q.options
//           .filter((opt) => opt.isSelected)
//           .map((opt) => opt.option._id);

//         initial[questionId] = selectedOptionIds;
//       }
//     });
//     return initial;
//   };

//   const [selectedOptions, setSelectedOptions] = useState(initializeSelected());
//   const initialSelectedOptions = initializeSelected();

//   const isDirty =
//     JSON.stringify(selectedOptions) !== JSON.stringify(initialSelectedOptions);

//   const handleOptionChange = (questionId, optionId, checked) => {
//     setSelectedOptions((prev) => {
//       const prevOptions = prev[questionId] || [];

//       return {
//         ...prev,
//         [questionId]: checked
//           ? [...new Set([...prevOptions, optionId])]
//           : prevOptions.filter((id) => id !== optionId),
//       };
//     });
//   };
//   const handleSubmit = async () => {
//     const answers = Object.entries(selectedOptions).map(
//       ([questionId, selectedOptionIds]) => ({
//         questionId,
//         selectedOptionIds,
//       })
//     );

//     const payload = {
//       answers,
//       selectedLocationIds: serviceLocations?.map((loc) => loc._id),
//     };

//     try {
//       const response = await selectedOptionsUpdate({
//         leadServiceId,
//         answers: payload,
//       }).unwrap();

//       if (response.success) {
//         showSuccessToast(
//           response?.message || 'Selected options updated successfully'
//         );
//       } else {
//         showErrorToast('Failed to update selected options');
//       }
//     } catch (error) {
//       console.error('Update failed:', error);
//       const errorMessage =
//         error?.data?.message ||
//         'An error occurred while updating selected options';
//       showErrorToast(errorMessage);
//     }
//   };

//   return (
//     <AccordionItem
//       value={`service-${leadServiceId}`}
//       className="border-b bg-white border-gray-200"
//     >
//       <AccordionTrigger className="py-4 px-4 hover:no-underline">
//         <div className="flex flex-col items-start text-left">
//           <h3 className="text-base font-medium text-gray-800">{title}</h3>

//           <div className="text-sm text-gray-500 mt-2">
//             <span className="font-medium">All leads</span>
//             <span className="mx-2 w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
//             <span className="font-medium">
//               {serviceLocations?.length || 0} location
//               {serviceLocations?.length > 1 ? 's' : ''}
//             </span>
//           </div>
//         </div>
//       </AccordionTrigger>

//       <AccordionContent className="px-4 pb-4 w-full">
//         <div className="space-y-4">
//           <Accordion
//             type="multiple"
//             collapsible
//             className="max-w-[85%] mx-auto"
//           >
//             {questions?.map((q, index) => {
//               const question = q?.question;
//               const questionId = question?._id;
//               const questionText =
//                 typeof question === 'string'
//                   ? question
//                   : question?.question || 'Untitled Question';

//               return (
//                 <AccordionItem
//                   key={questionId}
//                   value={`question-${questionId}`}
//                   className="border-none"
//                 >
//                   <AccordionTrigger className="py-4 px-0">
//                     <h4 className="text-base font-semibold text-gray-900 flex items-center">
//                       <span className="mr-2 w-5 h-5 flex items-center justify-center bg-slate-300 text-xs font-medium rounded-full text-gray-800">
//                         {index + 1}
//                       </span>
//                       {questionText}
//                     </h4>
//                   </AccordionTrigger>
//                   <AccordionContent>
//                     <div className="space-y-4 py-2 px-8">
//                       {q?.options?.map((optionObj) => {
//                         const optionId = optionObj?.option?._id;
//                         const optionName = optionObj?.option?.name;
//                         const questionId = q?.question?._id;

//                         if (!optionId || !optionName || !questionId)
//                           return null;

//                         return (
//                           <div
//                             key={optionId}
//                             className="flex items-center space-x-3"
//                           >
//                             <Checkbox
//                               id={optionId}
//                               checked={
//                                 selectedOptions[questionId]?.includes(
//                                   optionId
//                                 ) || false
//                               }
//                               onCheckedChange={(checked) =>
//                                 handleOptionChange(
//                                   questionId,
//                                   optionId,
//                                   checked
//                                 )
//                               }
//                             />
//                             <Label
//                               htmlFor={optionId}
//                               className="text-sm font-medium text-gray-700 cursor-pointer"
//                             >
//                               {optionName}
//                             </Label>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               );
//             })}
//           </Accordion>

//           <div className="max-w-[85%] mx-auto">
//             {/* You can uncomment and reuse LeadServiceAction if needed */}
//             <LeadServiceAction
//               leadServiceId={leadServiceId}
//               onSubmit={handleSubmit}
//               isDirty={isDirty}
//               // serviceLocations={serviceLocations}
//               // selectedLocationIds={selectedLocationIds}
//               // setSelectedLocationIds={setSelectedLocationIds}
//               // isDirtyLocation={isDirtyLocation}
//             />
//           </div>
//         </div>
//       </AccordionContent>
//     </AccordionItem>
//   );
// };

// export default ServiceCard;

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
import { useLeadServiceSelectedOptionsUpdateMutation } from '@/store/features/leadService/leadServiceApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import LeadServiceAction from './LeadServiceAction';

const ServiceCard = ({
  leadServiceId,
  title = 'Default Service Title',
  questions = [],
  serviceLocations = [],
}) => {
  const [selectedOptionsUpdate] = useLeadServiceSelectedOptionsUpdateMutation();

  const initializeSelected = () => {
    const initial = {};
    questions.forEach((q) => {
      const questionId = q?.question?._id;
      if (questionId) {
        const selectedOptionIds = q.options
          .filter((opt) => opt.isSelected)
          .map((opt) => opt.option._id);
        initial[questionId] = selectedOptionIds;
      }
    });
    return initial;
  };

  // ✅ Only run once on mount
  const [initialSelectedOptions] = useState(initializeSelected);
  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );

  console.log('selectedOptions', selectedOptions);
  const isDirty =
    JSON.stringify(selectedOptions) !== JSON.stringify(initialSelectedOptions);

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
      selectedLocationIds: serviceLocations?.map((loc) => loc._id),
    };

    console.log('payload', payload);

    try {
      const response = await selectedOptionsUpdate({
        leadServiceId,
        answers: payload,
      }).unwrap();

      if (response.success) {
        showSuccessToast(
          response?.message || 'Selected options updated successfully'
        );
      } else {
        showErrorToast('Failed to update selected options');
      }
    } catch (error) {
      console.error('Update failed:', error);
      const errorMessage =
        error?.data?.message ||
        'An error occurred while updating selected options';
      showErrorToast(errorMessage);
    }
  };

  return (
    <AccordionItem
      value={`service-${leadServiceId}`}
      className="border-b bg-white border-gray-200"
    >
      <AccordionTrigger className="py-4 px-4 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
          <div className="text-sm text-gray-500 mt-2">
            <span className="font-medium">All leads</span>
            <span className="mx-2 w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
            <span className="font-medium">
              {serviceLocations?.length || 0} location
              {serviceLocations?.length > 1 ? 's' : ''}
            </span>
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
            {questions?.map((q, index) => {
              const question = q?.question;
              const questionId = question?._id;
              const questionText =
                typeof question === 'string'
                  ? question
                  : question?.question || 'Untitled Question';

              return (
                <AccordionItem
                  key={questionId}
                  value={`question-${questionId}`}
                  className="border-none"
                >
                  <AccordionTrigger className="py-4 px-0">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center">
                      <span className="mr-2 w-5 h-5 flex items-center justify-center bg-slate-300 text-xs font-medium rounded-full text-gray-800">
                        {index + 1}
                      </span>
                      {questionText}
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2 px-8">
                      {q?.options?.map((optionObj) => {
                        const optionId = optionObj?.option?._id;
                        const optionName = optionObj?.option?.name;

                        if (!optionId || !optionName || !questionId)
                          return null;

                        return (
                          <div
                            key={optionId}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={optionId}
                              checked={
                                selectedOptions[questionId]?.includes(
                                  optionId
                                ) || false
                              }
                              onCheckedChange={(checked) =>
                                handleOptionChange(
                                  questionId,
                                  optionId,
                                  checked
                                )
                              }
                            />
                            <Label
                              htmlFor={optionId}
                              className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {optionName}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="max-w-[85%] mx-auto">
            <LeadServiceAction
              leadServiceId={leadServiceId}
              onSubmit={handleSubmit}
              isDirty={isDirty}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ServiceCard;
