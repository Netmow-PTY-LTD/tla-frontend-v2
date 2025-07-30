'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import { useForgotPassowrdMutation } from '@/store/features/auth/authApiService';

const ForgotPassword = () => {
  const router = useRouter();

  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirect(params.get('redirect'));
  }, []);

  const [handleforgotPassword, { isLoading, isSuccess, data }] =
    useForgotPassowrdMutation();

  useEffect(() => {
    if (data && !data?.success) {
      toast.error(data?.message);
    }

    if (!isLoading && isSuccess && data?.success) {
      toast.success(data?.message);
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }
    }
  }, [isLoading, isSuccess, data]);

  const onSubmit = (data) => {
    handleforgotPassword(data);
  };

  return (
    <>
      <div className="tla-auth-section flex justify-center items-center py-8 px-4">
        <div className="border border-gray-200 rounded-xl p-8 w-full max-w-[400px]">
          <h3 className="mb-2 text-2xl font-bold text-center">
            Forgot Password
          </h3>
          <p className="mb-6 text-md text-center text-[var(--color-text)]">
            Enter your email to reset your password
          </p>

          <div className="w-full">
            <FormWrapper
              // schema={}
              onSubmit={onSubmit}
            >
              <div className="">
                <TextInput label="Email" name="email" type="email" />
              </div>

              <Button className="w-full" size="lg" type="submit">
                Reset Password
              </Button>
            </FormWrapper>

            <div className="text-center mt-4 text-sm text-[var(--color-text)]">
              Remember your password?{' '}
              <Link
                className="text-[var(--secondary-color)] font-medium underline"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
