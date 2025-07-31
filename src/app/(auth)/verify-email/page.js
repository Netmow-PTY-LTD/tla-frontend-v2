import { CheckCircle } from 'lucide-react';
import React from 'react';


export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h1>
        <p className="text-gray-600 mb-6">
          Your account has been successfully verified. You can now log in and start using your account.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
