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
import { Loader2 } from 'lucide-react';

const claimSchema = z.object({
  lawyerProfileEmail: z.string().email({ message: "Invalid email address for the lawyer profile." }),
  claimerName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  claimerEmail: z.string().email({ message: "Invalid email address." }),
  claimerPhone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
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
      claimerPhone: '',
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
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Claim Your Lawyer Profile</CardTitle>
          <CardDescription className="text-lg">
            If you are the owner of a lawyer profile on our platform, you can claim it to manage your information and leads directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="claimerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="bg-slate-50 border-none focus-visible:ring-1" />
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
                      <FormLabel>Your Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} className="bg-slate-50 border-none focus-visible:ring-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="claimerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} className="bg-slate-50 border-none focus-visible:ring-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lawyerProfileEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Email to Claim</FormLabel>
                      <FormControl>
                        <Input placeholder="lawyer@firm.com" {...field} className="bg-slate-50 border-none focus-visible:ring-1" />
                      </FormControl>
                      <FormDescription>
                        The email associated with the profile you want to claim.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="claimReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Claim</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please explain why you are claiming this profile (e.g., 'This is my official profile and I would like to manage it directly.')" 
                        {...field} 
                        className="bg-slate-50 border-none min-h-[100px] focus-visible:ring-1"
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
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any other information that could help us verify your identity (e.g., years of practice, firm name, etc.)" 
                        {...field} 
                        className="bg-slate-50 border-none min-h-[80px] focus-visible:ring-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg h-12 shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Claim...
                  </>
                ) : (
                  'Submit Claim'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
