'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useSsoLoginMutation } from '@/store/features/auth/authApiService';
import { setUser } from '@/store/features/auth/authSlice';

import { verifyToken } from '@/utils/verifyToken';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

export default function SsoLoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('loading');


    const [ssoLogin] = useSsoLoginMutation();

    useEffect(() => {
        const token = router?.query?.token;
        if (!token) {
            setStatus('error');
            return;
        }

        const handleSsoLogin = async () => {
            try {
                const res = await ssoLogin({ token }).unwrap();

                if (res?.success === true) {
                    showSuccessToast(res?.message || 'Login successful');

                    const user = await verifyToken(res?.token);
                    if (user) {
                        const dispatched = dispatch(
                            setUser({
                                user: { ...res?.data, country: user?.country },
                                token: res?.token,
                            })
                        );


                        // Redirect based on role
                        if (dispatched?.payload?.token) {
                            if (res?.data?.regUserType === 'lawyer') router.push('/lawyer/dashboard');
                            else if (res?.data?.regUserType === 'client') router.push('/client/dashboard');
                            else if (res?.data?.regUserType === 'admin') router.push('/admin');
                        }

                        setStatus('success');
                    }
                } else {
                    setStatus('error');
                    showErrorToast(res?.message || 'SSO login failed');
                }
            } catch (error) {
                setStatus('error');
                const errorMessage = error?.data?.message || 'SSO login failed or expired';
                showErrorToast(errorMessage);
            }
        };

        handleSsoLogin();
    }, [router?.query?.token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-100">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white text-2xl font-bold rounded-full">
                        TLA
                    </div>
                </div>

                {/* Loading State */}
                {status === 'loading' && (
                    <>
                        <p className="text-gray-700 mb-4 text-lg font-medium">
                            Logging you in via SSO...
                        </p>
                        <div className="mx-auto mt-6 border-4 border-blue-200 border-t-blue-600 rounded-full w-12 h-12 animate-spin"></div>
                        <p className="text-gray-500 text-sm mt-4">Please wait a few seconds...</p>
                    </>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="text-center">
                        <div className="text-green-600 text-5xl mb-4">✅</div>
                        <p className="text-green-700 text-lg font-semibold">
                            Login successful!
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="text-center">
                        <div className="text-red-600 text-5xl mb-4">❌</div>
                        <p className="text-red-600 text-lg font-semibold">
                            SSO login failed or expired.
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Please request a new SSO link.
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
