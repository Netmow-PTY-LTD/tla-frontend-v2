'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import TextInput from '@/components/form/TextInput';
import FormWrapper from '@/components/form/FromWrapper';
import { useAuthLogOutMutation, useChangePasswordMutation } from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logOut } from '@/store/features/auth/authSlice';
import Cookies from 'js-cookie';
import { baseApi } from '@/store/baseApi/baseApi';

const ChangePassword = ({ open, setOpen }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [authLogout] = useAuthLogOutMutation();
  const [changePassword] = useChangePasswordMutation();

  const handleSubmit = async (data) => {
    try {
      const res = await changePassword(data).unwrap();
      if (res?.success) {
        showSuccessToast(res?.message || 'Change Password  Successful');
        localStorage.removeItem('accessToken'); // or cookies
        dispatch(logOut());
        authLogout();
        dispatch(baseApi.util.resetApiState());
        router.push('/login');
        setOpen(false);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium text-gray-700">
              Change password
            </DialogTitle>
          </DialogHeader>
          <FormWrapper onSubmit={handleSubmit}>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <label htmlFor="oldPassword" className="text-gray-700">
                  Old password
                </label>
                <div className="relative">
                  <TextInput
                    name="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    className="pr-10"
                    placeholder="***********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-gray-700">
                  New password
                </label>
                <div className="relative">
                  <TextInput
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className="pr-10"
                    placeholder="***********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                Confirm
              </Button>
            </DialogFooter>
          </FormWrapper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePassword;
