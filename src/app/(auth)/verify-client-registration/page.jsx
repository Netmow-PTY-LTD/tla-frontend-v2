'use client';

import {
    useClientRegistrationVerifyEmailMutation,
    useClientRegistrationCommitMutation,
} from '@/store/features/auth/authApiService';
import { setUser } from '@/store/features/auth/authSlice';
import { verifyToken } from '@/utils/verifyToken';
import { CheckCircle, Loader2, MailCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function VerifyClientRegistrationPage() {
    const searchParams = useSearchParams();
    const otp = searchParams.get('otp');
    const draftId = searchParams.get('draftId');
    const email = searchParams.get('email');

    const [verifyEmail] = useClientRegistrationVerifyEmailMutation();
    const [commitRegistration] = useClientRegistrationCommitMutation();
    //const [resendVerificationEmail] = useResendVerificationEmailMutation();

    const dispatch = useDispatch();
    const router = useRouter();

    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    //const [resendEmail, setResendEmail] = useState(email || '');
    //const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        const handleVerifyParams = async () => {
            if (!otp || !draftId) {
                // If parameters are missing, wait for user input or show error
                if (status === 'idle' && (!otp || !draftId)) {
                    // Maybe just show idle state or check if user manually navigates
                }
                return;
            }
            handleVerify();
        };

        handleVerifyParams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp, draftId]);

    const handleVerify = async () => {
        if (!otp || !draftId) {
            setStatus('error');
            setErrorMessage('Verification code or draft ID is missing.');
            return;
        }
        setStatus('loading');
        try {
            // 1. Verify Email
            const verifyRes = await verifyEmail({ draftId, code: otp }).unwrap();

            if (verifyRes?.success) {
                // 2. Commit Registration
                const commitRes = await commitRegistration({ draftId }).unwrap();

                if (commitRes?.success && commitRes?.token) {
                    const token = commitRes.token;
                    const userPayload = verifyToken(token);

                    if (userPayload) {
                        // Login the user
                        dispatch(setUser({ user: commitRes?.data?.userData, token }));
                        setStatus('success');

                        // Optional: Redirect after a delay
                        setTimeout(() => {
                            const userType = commitRes?.data?.userData?.regUserType;
                            if (userType === 'client') {
                                router.push(`/client/dashboard/my-cases/${commitRes?.data?.leadUser?._id}`);
                            } else {
                                router.push('/');
                            }
                        }, 2000);

                    } else {
                        throw new Error('Invalid token received.');
                    }
                } else {
                    throw new Error(commitRes?.message || 'Registration commit failed.');
                }
            } else {
                throw new Error(verifyRes?.message || 'Verification failed.');
            }
        } catch (error) {
            console.error('Verification Error:', error);
            setStatus('error');
            setErrorMessage(
                error?.data?.message || error?.message || 'Verification failed'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="animate-spin text-blue-500 w-12 h-12 mx-auto mb-4" />
                        <h1 className="text-lg font-semibold text-gray-700">
                            Verifying your email...
                        </h1>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Email Verified!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Your account has been successfully verified. You are being redirected...
                        </p>
                        <Link
                            href="/client/dashboard"
                            className="inline-block px-6 py-2 text-white bg-black rounded-xl transition hover:bg-gray-800"
                        >
                            Go to Dashboard
                        </Link>
                    </>
                )}

                {/* {status === 'resend' && (
                    <>
                        <MailCheck className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Resend Verification
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Enter your email to resend the verification link.
                        </p>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={resendEmail}
                            onChange={(e) => setResendEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={handleResend}
                            className="w-full px-6 py-2 text-white bg-blue-600 rounded-xl transition hover:bg-blue-700"
                        >
                            Resend Verification Email
                        </button>

                        {resendSuccess && (
                            <p className="text-green-600 mt-3">
                                Verification email sent successfully!
                            </p>
                        )}
                        {!resendSuccess && errorMessage && (
                            <p className="text-red-600 mt-3">{errorMessage}</p>
                        )}
                    </>
                )} */}

                {(status === 'error' || status === 'idle') && (
                    // Show error state or initial idle state if params missing
                    <>
                        {status === 'error' ? (
                            <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                        ) : (
                            <Loader2 className="animate-spin text-gray-400 w-12 h-12 mx-auto mb-4" />
                        )}

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {status === 'error' ? 'Verification Failed' : 'Waiting for details...'}
                        </h1>
                        <p className="text-gray-600 mb-6">{errorMessage || 'Checking verification details...'}</p>
                        {/* {status === 'error' && (
                            <button
                                onClick={() => setStatus('resend')}
                                className="inline-block px-6 py-2 text-white bg-red-500 rounded-xl transition hover:bg-red-600"
                            >
                                Try Resending
                            </button>
                        )} */}

                    </>
                )}
            </div>
        </div>
    );
}
