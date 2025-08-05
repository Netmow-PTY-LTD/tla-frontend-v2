'use client';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextInput from '@/components/form/TextInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { loginValidationSchema } from '@/schema/auth/authValidation.schema';
import { useAuthLoginMutation } from '@/store/features/auth/authApiService';
import { setUser } from '@/store/features/auth/authSlice';
import { verifyToken } from '@/utils/verifyToken';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState();
  const [rememberMe, setRememberMe] = useState(false);
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

  const onSubmit = async (data) => {
    try {
      const res = await authLogin(data).unwrap();

      console.log('res', res);

      if (res?.success === true) {
        showSuccessToast(res?.message || 'Login successful');
        const user = await verifyToken(res?.token);

        console.log('user', user);

        if (user) {
          const dispatchUser = dispatch(
            setUser({
              user: res?.data,
              token: res?.token,
            })
          );

          // ✅ Save to localStorage if rememberMe is checked
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', data.email);
          } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userEmail');
          }

          console.log('dispatchUser', res?.data?.regUserType);
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

  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    const email = localStorage.getItem('userEmail');

    if (remembered && email) {
      form.setValue('email', email);
      setRememberMe(true);
    }
  }, []);

  return (
    <>
      <div className="tla-auth-form tla-auth-form-login relative">
        <h3 className="tla-auth-title mb-4 text-center">
          Explore the opportunities
        </h3>
        <p className="tla-auth-subtitle text-center">
          1000’s of local and remote clients & lawyers are already waiting for
          your services
        </p>
        <h4 className="my-6 text-center">Login</h4>

        {/* Form Wrapper */}
        <FormWrapper onSubmit={onSubmit}>
          <div className="space-y-5">
            <TextInput
              label="Email"
              type="email"
              name="email"
              placeholder="John@example.com"
            />

            <div className="relative">
              <TextInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="********"
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-[12px] top-[43px] text-[var(--color-text)] cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-[12px] top-[43px] text-[var(--color-text)] cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <div className="flex flex-wrap justify-between">
              <label
                htmlFor="remember"
                className="flex gap-2 items-center cursor-pointer"
              >
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                Remember Me
              </label>

              <Link href="/forget-password" className="text-[#00C3C0]">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-auth-login bg-[var(--color-special)] w-full hover:bg-[--primary-color] transition-all duration-300"
              style={{ cursor: 'pointer' }}
              disabled={loading || isLoading}
            >
              {loading || isLoading ? <LoaderSpinner /> : <span>Log In</span>}
            </button>
          </div>
        </FormWrapper>

        {/* Footer with Register Link */}
        <div className="tla-auth-footer text-center">
          <span>Offering a legal service? </span>
          <Link href="/register">
            <b>Join as a Lawyer</b>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
