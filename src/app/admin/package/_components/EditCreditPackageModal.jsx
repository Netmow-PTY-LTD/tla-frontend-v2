import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import CheckboxInput from '@/components/form/CheckboxInput';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal';
import { useUpdateCreditPackageMutation } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import React, { useRef } from 'react';

export default function EditCreditPackageModal({
  open,
  onClose,
  selectedPackage,
  schema,
  refetchCreditPackages,
}) {
  const defaultValues = {
    name: selectedPackage?.name ?? '',
    credit: selectedPackage?.credit ?? 0,
    price: selectedPackage?.price ?? 0,
    priceDisplay: selectedPackage?.priceDisplay ?? 0,
    pricePerCredit: selectedPackage?.pricePerCredit ?? 0,
    discountPercentage: selectedPackage?.discountPercentage ?? 0,
    isActive: selectedPackage?.isActive ?? false,
  };

  const [updateCreatePackage, { isLoading }] = useUpdateCreditPackageMutation();
  const handleSubmit = async (data) => {
    const {
      name,
      credit,
      price,
      priceDisplay,
      pricePerCredit,
      discountPercentage,
      isActive,
    } = data;

    const payload = {
      _id: selectedPackage?._id,
      name,
      credit: Number(credit),
      price: Number(price),
      priceDisplay: Number(priceDisplay),
      pricePerCredit: Number(pricePerCredit),
      discountPercentage: discountPercentage
        ? Number(discountPercentage)
        : null,
      isActive: isActive ? true : false,
    };
    try {
      const res = await updateCreatePackage(payload).unwrap();
      // Optionally reset form or show success toast
      if (res) {
        showSuccessToast(res?.message || 'Package updated successfully!');
        refetchCreditPackages();
        onClose();
      }
    } catch (error) {
      console.error('Error adding package:', error);
      // Optionally show error toast
      showErrorToast(error?.data?.message || 'Failed to add package.');
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Edit Credit Package"
      width="max-w-[600px]"
    >
      <FormWrapper
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        // schema={schema}
      >
        <TextInput
          type="text"
          label="Package Name"
          name="name"
          placeholder="Enter Package Name"
        />
        <TextInput
          type="text"
          label="Credit"
          name="credit"
          placeholder="Enter credit amount"
        />

        <TextInput
          type="text"
          label="Package Price"
          name="price"
          placeholder="Enter Package Name"
        />

        <TextInput
          type="text"
          label="Price Display"
          name="priceDisplay"
          placeholder="Enter price display"
        />

        <TextInput
          type="text"
          label="Price Per Credit"
          name="pricePerCredit"
          placeholder="Enter price per credit"
        />

        <TextInput
          type="text"
          label="Discount Percentage"
          name="discountPercentage"
          placeholder="Enter discount percentage"
        />
        <CheckboxInput label="Active" name="isActive" />
        <Button type="submit">Update</Button>
      </FormWrapper>
    </Modal>
  );
}
