'use client';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import TextInput from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import { loginValidationSchema } from '@/schema/auth/authValidation.schema';
import { useAuthLoginMutation } from '@/store/features/auth/authApiService';
import { setUser } from '@/store/features/auth/authSlice';
import { verifyToken } from '@/utils/verifyToken';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [authLogin, { isLoading }] = useAuthLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleChange = (e) => {
    console.log(`Input changed for ${e.target.name}: ${e.target.value}`);
  };

  const onSubmit = async (data) => {
    try {
      const res = await authLogin(data).unwrap();

      console.log('res', res);

      if (res?.success === true) {
        showSuccessToast(res?.message || 'Login successful');
        const user = verifyToken(res?.token);

        console.log('user', user);

        if (user) {
          const dispatchUser = dispatch(
            setUser({
              user: res?.data,
              token: res?.token,
            })
          );

          //console.log('dispatchUser', dispatchUser);
          if (dispatchUser?.payload?.token) {
            if (res?.data?.regUserType === 'lawyer') {
              router.push(`/lawyer/dashboard`);
            } else if (res?.data?.regUserType === 'client') {
              router.push(`/client/dashboard`);
            } else if (res?.data?.regUserType === 'admin') {
              router.push(`/admin`);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="tla-auth-form tla-auth-form-login">
        <h2 className="tla-auth-title mb-2 text-center">
          Explore the opportunities
        </h2>
        <p className="tla-auth-subtitle text-center">
          1000’s of local and remote clients & lawyers are already waiting for
          your services
        </p>
        <h3 className="my-6 text-center">Login</h3>

        {/* Form Wrapper */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TextInput
              label="Email"
              type="email"
              control={form.control}
              name="email"
              placeholder="John@example.com"
              onChange={handleChange}
            />
            <TextInput
              label="Password"
              type="password"
              control={form.control}
              name="password"
              placeholder="********"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="btn-auth-login w-full"
              style={{ cursor: 'pointer' }}
              disabled={loading || isLoading}
            >
              {loading || isLoading ? <LoaderSpinner /> : <span>Submit</span>}
            </button>
          </form>
        </Form>

        {/* Footer with Register Link */}
        <div className="tla-auth-footer text-center">
          <span>Offering a service? </span>
          <Link href="/register">
            <b>Register as a professional</b>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
