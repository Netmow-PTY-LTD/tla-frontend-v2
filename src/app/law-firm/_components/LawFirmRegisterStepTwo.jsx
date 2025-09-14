import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { prevStep } from '@/store/features/auth/lawyerRegistrationSlice';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export default function LawFirmRegisterStepTwo() {
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      name: '',
    },
  });

  const { handleSubmit, control } = form;
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="w-full">
      <div className="tla-auth-form tla-auth-form-register relative z-1">
        <div className="absolute inset-0 flex items-center justify-center z-[-1]">
          <div className="w-[215px] h-[215px] rounded-full bg-[#00C3C080] blur-[100px]"></div>
        </div>
        <h3 className="tla-auth-title mb-8 text-center uppercase">
          License Details
        </h3>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 md:pr-5">
                  <FormField
                    control={control}
                    name="licenseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Type</FormLabel>
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
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="i.e. ABC1234567"
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
                    name="issuedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issued By</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="i.e. board of authority"
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
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Until</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="i.e. ABC1234567"
                            className="h-[44px] inline-block bg-[#F2F2F2] border-[#DCE2EA] focus-visible:ring-inset"
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
