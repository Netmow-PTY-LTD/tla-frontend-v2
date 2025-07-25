'use client';

import { useEffect, useMemo } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import {
  useGetBillingsDetailsQuery,
  useUpdateBillingDetailsMutation,
} from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import TextInput from '@/components/form/TextInput';
import CheckboxInput from '@/components/form/CheckboxInput';
import { InfoIcon } from 'lucide-react';

export default function InvoicingForm({ setInvoicesBillingsProgress }) {
  const { data: invoiceBillingData, refetch } = useGetBillingsDetailsQuery();
  const [updateBillingDetails] = useUpdateBillingDetailsMutation();

  const defaultValues = useMemo(
    () => ({
      contactName: invoiceBillingData?.data?.billingAddress?.contactName ?? '',
      addressLine1:
        invoiceBillingData?.data?.billingAddress?.addressLine1 ?? '',
      addressLine2:
        invoiceBillingData?.data?.billingAddress?.addressLine2 ?? '',
      city: invoiceBillingData?.data?.billingAddress?.city ?? '',
      postcode: invoiceBillingData?.data?.billingAddress?.postcode ?? '',
      phoneNumber: invoiceBillingData?.data?.billingAddress?.phoneNumber ?? '',
      isVatRegistered:
        invoiceBillingData?.data?.billingAddress?.isVatRegistered ?? false,
      // vatNumber: invoiceBillingData?.data?.billingAddress?.vatNumber ?? '',
    }),
    [invoiceBillingData]
  );

  const methods = useForm({ defaultValues });
  const { handleSubmit, control, reset } = methods;

  // Reset form when data changes
  useEffect(() => {
    if (invoiceBillingData?.data?.billingAddress) {
      reset(defaultValues);
    }
  }, [invoiceBillingData, reset, defaultValues]);

  // Watch form values for progress
  const watchedValues = useWatch({ control });

  useEffect(() => {
    const totalFields = 7;
    let filled = 0;

    const {
      contactName,
      addressLine1,
      addressLine2,
      city,
      postcode,
      phoneNumber,
      isVatRegistered,
      vatNumber,
    } = watchedValues;

    if (contactName?.trim()) filled++;
    if (addressLine1?.trim()) filled++;
    if (addressLine2?.trim()) filled++;
    if (city?.trim()) filled++;
    if (postcode?.trim()) filled++;
    if (phoneNumber?.trim()) filled++;
    // if (isVatRegistered && vatNumber?.trim()) filled++;
    if (isVatRegistered) filled++;

    const progress = Math.round((filled / totalFields) * 100);
    setInvoicesBillingsProgress(progress);
  }, [watchedValues, setInvoicesBillingsProgress]);

  const onSubmit = async (formData) => {
    try {
      const res = await updateBillingDetails(formData).unwrap();
      showSuccessToast(res.message || 'Billing details updated');
      refetch();
    } catch (err) {
      showErrorToast(err?.data?.message || 'Failed to update billing info');
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[900px] mx-auto p-6 space-y-6"
      >
        <h2 className="heading-lg font-bold text-gray-900">
          Invoices and billing details
        </h2>

        <div className="flex items-center gap-3 p-4 rounded-md bg-gray-100">
          <InfoIcon className="h-6 w-6 text-[#00C3C0]" />
          <p className="text-sm text-gray-700">
            We use these billing details to contact you but don’t share them
            with customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            name="contactName"
            label="Contact Name"
            placeholder="Name"
          />
          <TextInput
            name="phoneNumber"
            label="Phone Number"
            placeholder="Phone"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput name="addressLine1" label="Address Line 1" />
          <TextInput name="addressLine2" label="Address Line 2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput name="city" label="City" />
          <TextInput name="postcode" label="Post Code" />
        </div>

        <div className="flex items-center space-x-2">
          <CheckboxInput name="isVatRegistered" label="I am VAT registered" />
        </div>

        <div className="flex justify-end pt-4">
          <button className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]">
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

// 'use client';
// import { useEffect, useMemo, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { InfoIcon } from 'lucide-react';
// import FormWrapper from '@/components/form/FromWrapper';
// import TextInput from '@/components/form/TextInput';
// import CheckboxInput from '@/components/form/CheckboxInput';
// import {
//   useGetBillingsDetailsQuery,
//   useUpdateBillingDetailsMutation,
// } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
// import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
// import { CreditTransactionLog } from './CreditTransactionLog';
// import { BillingTransactionDetails } from './BillingTransactionTable';

// const InvoicingForm = () => {
//   const { data: invoiceBillingData, refetch: refetchBillingDetails } =
//     useGetBillingsDetailsQuery();

//   const defaultValues = useMemo(
//     () => ({
//       contactName: invoiceBillingData?.data?.billingAddress?.contactName ?? '',
//       addressLine1:
//         invoiceBillingData?.data?.billingAddress?.addressLine1 ?? '',
//       addressLine2:
//         invoiceBillingData?.data?.billingAddress?.addressLine2 ?? '',
//       city: invoiceBillingData?.data?.billingAddress?.city ?? '',
//       postcode: invoiceBillingData?.data?.billingAddress?.postcode ?? '',
//       phoneNumber: invoiceBillingData?.data?.billingAddress?.phoneNumber ?? '',
//       isVatRegistered:
//         invoiceBillingData?.data?.billingAddress?.isVatRegistered ?? false,
//       vatNumber: invoiceBillingData?.data?.billingAddress?.vatNumber ?? '',
//     }),
//     [invoiceBillingData]
//   );

//   const [updateBillingDetails] = useUpdateBillingDetailsMutation();

//   const handleSubmit = async (data) => {
//     try {
//       const res = await updateBillingDetails(data).unwrap();
//       if (res?.success === true) {
//         showSuccessToast(
//           res?.message || 'Billing details updated successfully'
//         );
//         refetchBillingDetails();
//       }
//       console.log('Update response:', res);
//     } catch (error) {
//       const errorMessage = error?.data?.message || 'An error occurred';
//       showErrorToast(errorMessage);
//       console.error('Error in saving billing details updates:', error);
//     }
//   };

//   const formKey = useMemo(() => {
//     return JSON.stringify(invoiceBillingData?.data?.billingAddress ?? {});
//   }, [invoiceBillingData]);

//   return (
//     <div className="max-w-[900px] mx-auto p-6">
//       <div className="mb-8">
//         <h2 className="heading-lg font-bold text-gray-900 mb-4">
//           Invoices and billing details
//         </h2>

//         <div className="flex items-start gap-3 p-4  rounded-md mb-6">
//           <InfoIcon className="h-6 w-6 text-[#00C3C0] flex-shrink-0 mt-0.5" />
//           <p className="text-sm text-gray-700">
//             We'll use these account details to contact you but won't share them
//             with customers. You can control the contact details that customers
//             see for your business in{' '}
//             <span className="text-[#00C3C0] font-medium hover:underline cursor-pointer">
//               My Profile
//             </span>
//             .
//           </p>
//         </div>
//       </div>

//       <FormWrapper
//         onSubmit={handleSubmit}
//         defaultValues={defaultValues}
//         key={formKey}
//       >
//         <div className="space-y-6">
//           <div>
//             <h3 className="heading-md font-semibold text-gray-900 mb-2">
//               Billing Address
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Your business address for billing & invoicing
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <TextInput
//                 label="Contact name"
//                 name="contactName"
//                 placeholder="Name"
//                 className="bg-white h-10"
//               />
//             </div>

//             <div className="space-y-2">
//               <TextInput
//                 label="Phone number"
//                 name="phoneNumber"
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="bg-white h-10"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <TextInput
//                 label={'Address line 1'}
//                 name="addressLine1"
//                 placeholder="Address Line 1"
//                 className="bg-white h-10"
//               />
//             </div>

//             <div className="space-y-2">
//               <TextInput
//                 label={'Address line 2'}
//                 name="addressLine2"
//                 placeholder="Address line 2"
//                 className="bg-white h-10"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <TextInput
//                 label="City"
//                 name="city"
//                 placeholder="City"
//                 className="bg-white h-10"
//               />
//             </div>

//             <div className="space-y-2">
//               <TextInput
//                 label="Post code"
//                 name="postcode"
//                 placeholder="Post code"
//                 className="bg-white h-10"
//               />
//             </div>
//           </div>

//           <div className="flex items-center space-x-2 mt-4">
//             <CheckboxInput name="isVatRegistered" label="I am VAT registered" />
//             {/* <Checkbox
//               id="vat"
//               checked={isVatRegistered}
//               onCheckedChange={(checked) => setIsVatRegistered(!!checked)}
//             />
//             <Label htmlFor="vat" className="text-sm font-normal cursor-pointer">
//               I am VAT registered
//             </Label> */}
//           </div>
//         </div>
//         {/* Footer Buttons */}
//         <div className="flex justify-between items-center pt-4 ">
//           <button className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]">
//             Save
//           </button>
//         </div>
//       </FormWrapper>
//     </div>
//   );
// };

// export default InvoicingForm;
