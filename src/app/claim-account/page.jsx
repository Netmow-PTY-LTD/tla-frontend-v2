'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useSubmitLawyerProfileClaimMutation } from '@/store/features/admin/lawyerProfileClaimService';
import { Loader2, User, Mail, FileText, Info, ShieldCheck, ShieldCheckIcon } from 'lucide-react';
import MainLayout from '@/components/main/common/layout';

const claimSchema = z.object({
  lawyerProfileEmail: z.string().email({ message: "Invalid email address for the lawyer profile." }),
  claimerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  claimerEmail: z.string().email({ message: "Invalid email address." }),
  claimReason: z.string().min(10, { message: "Please provide a more detailed reason for the claim." }),
  additionalInfo: z.string().optional(),
});

export default function ClaimAccountPage() {
  const [submitClaim, { isLoading }] = useSubmitLawyerProfileClaimMutation();

  const form = useForm({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      lawyerProfileEmail: '',
      claimerName: '',
      claimerEmail: '',
      claimReason: '',
      additionalInfo: '',
    },
  });

  async function onSubmit(values) {
    try {
      await submitClaim(values).unwrap();
      showSuccessToast('Claim submitted successfully. Our team will review it shortly.');
      form.reset();
    } catch (error) {
      showErrorToast(error?.data?.message || 'Failed to submit claim. Please try again.');
    }
  }

  return (
    <MainLayout>
      <section className='py-10 md:py-16 relative overflow-hidden bg-slate-50'>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-special)] opacity-5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-special)] opacity-5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

        <div className="mx-auto px-4 max-w-5xl w-full relative z-10">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-special)] bg-opacity-10 text-[var(--color-special)] mb-2">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Claim Your Profile
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              If you own a lawyer profile on our platform, claim it now to manage your details and connect with clients directly.
            </p>
          </div>

          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-[var(--color-special)] rounded-full"></div>
                <CardTitle className="text-xl md:text-2xl font-bold uppercase tracking-wider">
                  Account Claim Request
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400 text-base">
                Please provide the following details to help us verify your identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  {/* Personal Information Group */}
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="claimerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Your Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <Input placeholder="John Doe" {...field} className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-1 focus:ring-[var(--color-special)] transition-all h-11" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="claimerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Your Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <Input placeholder="john@example.com" {...field} className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-1 focus:ring-[var(--color-special)] transition-all h-11" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* Profile Identification Group */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="lawyerProfileEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">Profile Email to Claim</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                              <Input placeholder="lawyer@firm.com" {...field} className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-1 focus:ring-[var(--color-special)] transition-all h-11" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            Enter the email address currently listed on the profile you are claiming.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Documentation Group */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="claimReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">Reason for Claim</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please explain why you are claiming this profile..."
                              {...field}
                              className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-1 focus:ring-[var(--color-special)] transition-all min-h-[120px] resize-none p-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">Any Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Years of practice, firm affiliation, etc."
                              {...field}
                              className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-1 focus:ring-[var(--color-special)] transition-all min-h-[100px] resize-none p-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="text-lg h-14 bg-[var(--color-special)] hover:opacity-90 text-white shadow-[0_10px_30px_rgba(0,195,192,0.3)] transition-all transform hover:-translate-y-1 rounded-2xl font-bold mt-4 px-8"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing Request...
                        </span>
                      ) : (
                        'Submit Account Claim'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="text-center text-slate-400 text-sm mt-8 px-6 italic">
            All claim requests are manually reviewed by our compliance team. Verification may take 2-3 business days.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
