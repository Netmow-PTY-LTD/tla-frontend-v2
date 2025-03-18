'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import TextInput from '@/components/form/TextInput';
import { useAuthLoginMutation } from '@/store/slices/public/authSlice';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import Cookies from 'js-cookie';

const appEnvironment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT;

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: 'Email must be at least 2 characters.',
    })
    .email({
      message: 'Please enter a valid email address.',
    }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
});

export default function Login() {
  const [authLogin, { isLoading }] = useAuthLoginMutation();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');

    if (!token || !role) {
      Cookies.remove('token');
      Cookies.remove('role');
    } else {
      const dashboardPath = role === 'super_admin' ? 'super-admin' : role;
      if (appEnvironment === 'development') {
        window.location.assign(
          `${
            window.location.protocol
          }//${'localhost:3000'}/dashboard/${dashboardPath}`
        );
      } else {
        window.location.assign(
          `${window.location.protocol}//${process.env.NEXT_PUBLIC_REDIRECT_URL}/dashboard/${dashboardPath}`
        );
      }
    }
  }, []);

  const handleChange = (e) => {
    console.log(`Input changed for ${e.target.name}: ${e.target.value}`);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await authLogin(data).unwrap();
      console.log(res);

      if (res?.success === true) {
        showSuccessToast(res?.message || 'Login successful');
        console.log(res?.data?.token);
        console.log(res?.data?.role);

        if (res?.data?.token && res?.data?.role === 'super_admin') {
          Cookies.set('token', res?.data?.token, { expires: 7 });
          Cookies.set('role', res?.data?.role, { expires: 7 });

          if (appEnvironment === 'development') {
            window.location.assign(
              `${
                window.location.protocol
              }//${'localhost:3000'}/dashboard/super-admin`
            );
          } else {
            window.location.assign(
              `${window.location.protocol}//${process.env.NEXT_PUBLIC_REDIRECT_URL}/dashboard/super-admin`
            );
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
    <section
      className="tla-auth-section"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper">
          <div className="tla-auth-box">
            <div className="flex flex-wrap items-center">
              {/* Image Section (Hidden on mobile) */}
              <div className="hidden md:block md:w-1/3">
                <div className="tla-auth-image">
                  <Image
                    src="/assets/img/auth-login.png"
                    width={600}
                    height={751}
                    alt="Auth Image"
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3">
                <div className="tla-auth-form tla-auth-form-login">
                  <h2 className="tla-auth-title mb-2 text-center">
                    Explore the opportunities
                  </h2>
                  <p className="tla-auth-subtitle text-center">
                    1000’s of local and remote clients & lawyers are already
                    waiting for your services
                  </p>
                  <h3 className="my-6 text-center">Login</h3>

                  {/* Form Wrapper */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
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
                        className="btn-auth-login"
                        style={{ cursor: 'pointer' }}
                        disabled={loading || isLoading}
                      >
                        {loading || isLoading ? (
                          <LoaderSpinner />
                        ) : (
                          <span>Submit</span>
                        )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
