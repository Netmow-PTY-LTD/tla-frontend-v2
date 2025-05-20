import React, { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterStepThree({
  handleBack,
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  soloPractitioner,
  setSoloPractitioner,
  companyTeam,
  setCompanyTeam,
  ompanyName,
  setCompanyName,
  companyWebsite,
  setCompanyWebsite,
  companySize,
  setCompanySize,
  handleFinalSubmit,
  isLoading,
}) {
  const [isCompany, setIsCompany] = useState(false);

  const formSchema = z
    .object({
      username: z.string().min(2, {
        message: 'Name is required and must be at least 2 characters.',
      }),
      email: z.string().email({
        message: 'Please enter a valid email address.',
      }),
      phone: z
        .string()
        .nonempty({ message: 'Phone number is required' })
        .regex(/^[0-9]{10,15}$/, {
          message: 'Phone number must be 10–15 digits',
        }),
      soloPractitioner: z.boolean(),
      companyTeam: z.boolean(),
      company_name: z.string().optional(),
      company_website: z.string().optional(),
      company_size: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.companyTeam) {
        if (!data.company_name || data.company_name.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['company_name'],
            message: 'Company name is required',
          });
        }

        if (!data.company_website || data.company_website.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['company_website'],
            message: 'Company website is required',
          });
        }

        if (!data.company_size || data.company_size.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['company_size'],
            message: 'Company size is required',
          });
        }

        if (data.company_website) {
          try {
            new URL(data.company_website);
          } catch {
            ctx.addIssue({
              path: ['company_website'],
              code: z.ZodIssueCode.custom,
              message:
                'Invalid website URL - please use full URL including https://',
            });
          }
        }
      }
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      soloPractitioner: false,
      companyTeam: false,
      company_name: '',
      company_website: '',
      company_size: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap items-center">
        <div className="hidden lg:block lg:max-w-[602]">
          <div className="tla-auth-image">
            <Image
              src="/assets/img/auth-step3.png"
              width={602}
              height={751}
              alt="Auth Image"
            />
          </div>
        </div>
        <div className="w-full lg:w-7/12">
          <div className="tla-auth-form tla-auth-form-register">
            <h2 className="tla-auth-title mb-2">Some details about you</h2>
            <p className="tla-auth-subtitle mb-5">
              You’re just a few steps away from viewing our Family Law leads{' '}
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="tla-form-control"
                          onChange={(e) => {
                            // Get raw input value
                            let val = e.target.value;

                            // Convert to unique username format:
                            val = val
                              .trim() // remove leading/trailing spaces
                              .toLowerCase() // lowercase
                              .replace(/\s+/g, '_') // replace spaces with underscores
                              .replace(/[^a-z0-9_]/g, ''); // remove special chars except underscore and alphanumeric

                            field.onChange(val); // update react-hook-form value
                            setUsername(val); // your custom state update
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 md:pr-1">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe@gmail.com"
                              {...field}
                              className="tla-form-control"
                              onChange={(e) => {
                                field.onChange(e); // Let react-hook-form track it
                                setEmail(e.target.value); // Your custom logic
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full md:w-1/2 md:pl-1">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="phone number"
                              {...field}
                              className="tla-form-control"
                              onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(
                                  /[^0-9]/g,
                                  ''
                                ); // Remove non-numeric chars
                                field.onChange(onlyNumbers); // Update react-hook-form
                                setPhone(onlyNumbers); // Your custom logic (if needed)
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="soloPractitioner"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          {...field}
                          checked={field.value} // control from react-hook-form
                          onCheckedChange={(checked) => {
                            field.onChange(checked); // update form state
                            setSoloPractitioner(checked); // update your custom state
                          }}
                        />
                      </FormControl>
                      <FormLabel className="ml-2 font-bold">
                        I will work as solo practitioner
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setCompanyTeam(checked);
                            setIsCompany(checked);

                            if (!checked) {
                              // Clear company-related values when unchecked
                              setCompanyName('');
                              setCompanyWebsite('');
                              setCompanySize('2-10');
                              form.setValue('company_name', '');
                              form.setValue('company_website', '');
                              form.setValue('company_size', '');
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="ml-2 font-bold">
                        I work with a company/team
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isCompany && (
                  <>
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/2 md:pr-1">
                        <FormField
                          control={form.control}
                          name="company_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Company"
                                  {...field}
                                  className="tla-form-control"
                                  onChange={(e) => {
                                    field.onChange(e); // Let react-hook-form track it
                                    setCompanyName(e.target.value); // Your custom logic
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full md:w-1/2 md:pl-1">
                        <FormField
                          control={form.control}
                          name="company_website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Website*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://"
                                  {...field}
                                  className="tla-form-control"
                                  onChange={(e) => {
                                    field.onChange(e); // Let react-hook-form track it
                                    setCompanyWebsite(e.target.value); // Your custom logic
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="company-size">
                      <label>Company Size, Team Members</label>
                      <div className="flex flex-wrap gap-2">
                        {['2-10', '11-50', '51-100', '100+'].map((size) => (
                          <button
                            type="button"
                            key={size}
                            onClick={() => {
                              setCompanySize(size); // your local state
                              form.setValue('company_size', size); // sync with react-hook-form
                            }}
                            className={`${
                              companySize === size ? 'selected' : ''
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                        <input
                          type="hidden"
                          {...form.register('company_size')}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-wrap justify-end gap-3 mt-10">
                  <button
                    type="submit"
                    className="btn-outline"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn-auth-register"
                    onClick={form.handleSubmit(handleFinalSubmit)}
                    disabled={isLoading} // <- disable when submitting
                  >
                    {isLoading ? 'Submitting...' : 'Finish & See Leads'}
                  </button>

                  {/* <button type="submit" className="btn-auth-register">
                    Finish & See Leads
                  </button> */}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
