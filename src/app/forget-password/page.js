"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import FormWrapper from "@/components/form/FromWrapper";
import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";
import { useForgotPassowrdMutation } from "@/store/features/auth/authApiService";


const ForgotPassword = () => {
    const router = useRouter();

    const [redirect, setRedirect] = useState(null);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        setRedirect(params.get("redirect"));
    }, []);

    const [handleforgotPassword, { isLoading, isSuccess, data }] = useForgotPassowrdMutation();
 
    useEffect(() => {
        if (data && !data?.success) {
            toast.error(data?.message);
        }

        if (!isLoading && isSuccess && data?.success) {
            toast.success(data?.message);
            if (redirect) {
                router.push(redirect);
            } else {
                router.push("/");
            }
        }
    }, [isLoading, isSuccess, data]);

    const onSubmit = (data) => {
        handleforgotPassword(data);  
    };

    return (
        <>
            {isLoading}
            <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
                <h3 className="my-4 text-3xl font-bold ">Forgot Password</h3>
                <p className="mb-6 text-lg">Enter your email to reset your password</p>

                <div className="w-full max-w-md">
                    <FormWrapper
                            // schema={}
                        onSubmit={onSubmit}
                    >
                        <div className="py-4">
                            <TextInput label="Email" name="email" type="email" />
                        </div>

                        <Button
                            className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
                            size="lg"
                            type="submit"
                        >
                            Reset Password
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

export default ForgotPassword;