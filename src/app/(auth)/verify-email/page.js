'use client';

import { useResendVerificationEmailMutation, useVerifyEmailMutation } from '@/store/features/auth/authApiService';
import { CheckCircle, Loader2, MailCheck, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EmailVerifiedPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [verifyEmail] = useVerifyEmailMutation();
    const [resendVerificationEmail] = useResendVerificationEmailMutation();

    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        const handleVerify = async () => {
            if (!code) {
                setStatus('error');
                setErrorMessage('Verification code is missing.');
                return;
            }
            setStatus('loading');
            try {
                const res = await verifyEmail({ code }).unwrap();
                if (res?.success) {
                    setStatus('success');
                } else {
                    throw new Error(res?.message || 'Unknown verification error');
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage(error?.data?.message || error?.message || 'Verification failed');
            }
        };

        handleVerify();
    }, [code, verifyEmail]);

    const handleResend = async () => {
        if (!resendEmail) {
            setErrorMessage('Please enter your email');
            return;
        }

        setStatus('loading');
        setErrorMessage('');
        try {
            await resendVerificationEmail({ email: resendEmail }).unwrap();
            setResendSuccess(true);
            setStatus('resend');
        } catch (error) {
            setResendSuccess(false);
            setStatus('resend');
            setErrorMessage(error?.data?.message || error?.message || 'Failed to resend email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">

                {status === 'loading' && (
                    <>
                        <Loader2 className="animate-spin text-blue-500 w-12 h-12 mx-auto mb-4" />
                        <h1 className="text-lg font-semibold text-gray-700">Verifying your email...</h1>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h1>
                        <p className="text-gray-600 mb-6">
                            Your account has been successfully verified. You can now log in.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block px-6 py-2 text-white bg-black rounded-xl transition hover:bg-gray-800"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'resend' && (
                    <>
                        <MailCheck className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Resend Verification</h1>
                        <p className="text-gray-600 mb-4">Enter your email to resend the verification link.</p>

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
                            <p className="text-green-600 mt-3">Verification email sent successfully!</p>
                        )}
                        {!resendSuccess && errorMessage && (
                            <p className="text-red-600 mt-3">{errorMessage}</p>
                        )}
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
                        <p className="text-gray-600 mb-6">{errorMessage}</p>
                        <button
                            onClick={() => setStatus('resend')}
                            className="inline-block px-6 py-2 text-white bg-red-500 rounded-xl transition hover:bg-red-600"
                        >
                            Try Resending
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
