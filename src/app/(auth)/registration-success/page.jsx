'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Mail, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegistrationSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-special)] opacity-5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-special)] opacity-5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-lg w-full space-y-6 relative z-10">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-special)] bg-opacity-10 mb-6">
                        <Check className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                        Account Created Successfully!
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Thank you for registering with <b>TheLawApp</b>. You're just one step away from joining our professional network.
                    </p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 space-y-4">
                    <div className="flex flex-wrap sm:flex-nowrap items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--color-special)] bg-opacity-5">
                                <Mail className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Email Verification Required</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                A verification link has been sent to your registered email address.
                                Please check your inbox (and spam folder) and follow the instructions to activate your account.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                        <p className="text-sm text-slate-500 italic font-semibold mb-6">
                            Once verified, you'll be able to review available cases and complete your professional profile.
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            <Button asChild className="w-full bg-[var(--color-special)] hover:opacity-90 text-white h-12 rounded-xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(0,195,192,0.2)]">
                                <Link href="/login" className="flex items-center justify-center gap-2">
                                    Go to Login <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="w-full h-12 rounded-xl text-slate-600 hover:text-slate-900 transition-all font-medium">
                                <Link href="/" className="flex items-center justify-center gap-2">
                                    <Home className="h-5 w-5" /> Back to Home
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-8">
                    Need help? <Link href="/contact" className="text-[var(--color-special)] hover:underline">Contact our support team</Link>
                </p>
            </div>
        </div>
    );
}
