import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ServiceCard = ({ title }) => {
  return (
    <AccordionItem value={title} className="border-b bg-white border-gray-200">
      <AccordionTrigger className="py-4 px-4 hover:no-underline">
        <div className="flex flex-col items-start text-left">
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            Every customer answers this series of questions, allowing you to
            define exactly which type of leads you see.
          </p>
          <p className="text-sm text-gray-500 mt-1">All leads · 1 location</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">
          <div className="bg-white rounded-md p-4 border border-gray-100">
            <h4 className="font-medium text-gray-800">
              Which of these best describes you?
            </h4>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ServiceCard;
