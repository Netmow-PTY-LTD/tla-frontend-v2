'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InfoIcon } from 'lucide-react';

const InvoicingForm = () => {
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const onSave = () => console.log('Save clicked');
  const onCancel = () => console.log('Cancel clicked');

  return (
    <div className="max-w-[900px] mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Invoices and billing details
        </h2>

        <div className="flex items-start gap-3 p-4  rounded-md mb-6">
          <InfoIcon className="h-6 w-6 text-[#00C3C0] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            We'll use these account details to contact you but won't share them
            with customers. You can control the contact details that customers
            see for your business in{' '}
            <span className="text-[#00C3C0] font-medium hover:underline cursor-pointer">
              My Profile
            </span>
            .
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Billing Address
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Your business address for billing & invoicing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact name</Label>
            <Input
              id="contact-name"
              placeholder="Name"
              className="bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone number</Label>
            <Input
              id="phone-number"
              placeholder="Number"
              className="bg-white h-10"
              type="tel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address-line-1">Address line 1</Label>
            <Input
              id="address-line-1"
              placeholder="Address 1"
              className="bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-line-2">Address line 2</Label>
            <Input
              id="address-line-2"
              placeholder="Address 2"
              className="bg-white h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="City" className="bg-white h-10" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-code">Post code</Label>
            <Input
              id="post-code"
              placeholder="Post code"
              className="bg-white h-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="vat"
            checked={isVatRegistered}
            onCheckedChange={(checked) => setIsVatRegistered(!!checked)}
          />
          <Label htmlFor="vat" className="text-sm font-normal cursor-pointer">
            I am VAT registered
          </Label>
        </div>
      </div>
      {/* Footer Buttons */}
      <div className="flex justify-between items-center pt-4 ">
        <button
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-[#12C7C4] text-white px-4 py-2 text-sm rounded-md hover:bg-[#10b0ae]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InvoicingForm;
