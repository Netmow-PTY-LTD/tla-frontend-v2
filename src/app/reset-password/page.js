"use client";

import FormWrapper from "@/components/form/FromWrapper";
import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";

import { useResetPassowrdMutation } from "@/store/features/auth/authApiService";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";



const ResetPassword = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const router = useRouter();
  const [handleResetPassword,{isLoading,isSuccess,data}] = useResetPassowrdMutation();

  console.log('check reset password data ==>',data)


  useEffect(() => {
    // Manually parse query parameters from URL
    const searchParams = new URLSearchParams(window.location.search);
    setToken(searchParams.get("token"));
    setEmail(searchParams.get("email"));
  }, []);



  useEffect(() => {
    if (data && !data?.success) {
      toast.error(data?.message );
    }

    if (!isLoading && isSuccess) {
      toast.success(data?.message);
      router.push("/login");
    }
  }, [isLoading, isSuccess, data]);

  const onSubmit = (data) => {
    handleResetPassword({ ...data, email, token });
  };

  return (
    <>
      {isLoading}
      <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
        <h3 className="my-4 text-3xl font-bold">Reset Password</h3>
        <p className="mb-6 text-lg">Enter your new password to reset it</p>

        <div className="w-full max-w-md">
          <FormWrapper
        //    schema={}
            onSubmit={onSubmit}
          >
            <div className="py-4">
              <TextInput
                label="New Password"
                name="newPassword"
                type="password"
              />
            </div>

            <Button
              className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
              size="lg"
              type="submit"
            >
              Set New Password
            </Button>
          </FormWrapper>

          <div className="text-center mt-4 ">
            Remember your password?{" "}
            <Link className="text-blue-500 hover:underline" href="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;