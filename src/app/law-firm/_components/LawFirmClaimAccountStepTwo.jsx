import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/UIComponents/fileUploader';
import { prevStep } from '@/store/features/auth/lawyerRegistrationSlice';
import { CloudUpload, Download, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export default function LawFirmClaimAccountStepTwo() {
  const [previews, setPreviews] = useState([]);

  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      name: '',
    },
  });

  const { control, handleSubmit } = form;

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const newFiles = selectedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      return { name: file.name, url, type: file.type };
    });

    setPreviews((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 5); // limit max 5 files
    });
  };

  const handleRemove = (index) => {
    setPreviews((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  console.log('previews', previews);

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full">
      <div className="tla-auth-form tla-auth-form-register relative z-1">
        <div className="absolute inset-0 flex items-center justify-center z-[-1]">
          <div className="w-[215px] h-[215px] rounded-full bg-[#00C3C080] blur-[100px]"></div>
        </div>
        <h3 className="tla-auth-title mb-5 text-center uppercase">
          Claim Proof
        </h3>
        <p className="tla-auth-subtitle text-center text-muted mb-8">
          Verify your rights by submitting valid ownership documentation.
        </p>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 md:pr-5">
                  <FormField
                    control={control}
                    name="reporter_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="i.e. 1234567890"
                            className="h-[44px] bg-[#F2F2F2] border-[#DCE2EA] focus-visible:ring-inset"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full md:w-1/2 md:pl-5">
                  <FormField
                    control={control}
                    name="reporter_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Work Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="i.e. abc@xyz.com"
                            className="h-[44px] bg-[#F2F2F2] border-[#DCE2EA] focus-visible:ring-inset"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 md:pr-5">
                  <FormField
                    control={control}
                    name="reporter_role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="i.e. director etc"
                            className="h-[44px] bg-[#F2F2F2] border-[#DCE2EA] focus-visible:ring-inset"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full md:w-1/2 md:pl-5">
                  <Label className="mb-3 inline-block">
                    Attach Proof of Ownership
                  </Label>
                  <FileUploader
                    name="reporter_proof"
                    multiple={true}
                    icon={<CloudUpload className="w-4 h-4" />}
                    onChange={handleFilesChange}
                  />
                </div>
              </div>
              {previews.length > 0 && (
                <>
                  <Label className="mb-3 inline-block text-base font-semibold">
                    Attached Files:
                  </Label>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {previews.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 border rounded-lg"
                      >
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* File Preview */}
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : file.type === 'application/pdf' ? (
                          <iframe
                            src={file.url}
                            title={file.name}
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-xs text-gray-500">
                            {file.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between gap-3 mt-10">
              <button
                type="button"
                className="btn-default btn-outline-black"
                onClick={() => dispatch(prevStep())}
                // disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-default bg-[var(--color-special)] flex items-center justify-center gap-2"
                // disabled={isLoading} // optional: prevent double submit
              >
                {/* {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Finish & See cases'
              )} */}
                Finish
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
