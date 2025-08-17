// 'use client';

// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import TextInput from '@/components/form/TextInput';
// import FormWrapper from '@/components/form/FromWrapper';
// import { useRequestEmailChangeMutation } from '@/store/features/auth/authApiService';
// import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

// const ChangeEmail = ({ open, setOpen }) => {
// //   const [requestEmailChange] = useRequestEmailChangeMutation();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (data) => {
//     // try {
//     //   setLoading(true);
//     //   const res = await requestEmailChange(data).unwrap();
//     //   if (res?.success) {
//     //     showSuccessToast(
//     //       res?.message || 'Verification email sent to your new email'
//     //     );
//     //     setOpen(false);
//     //   }
//     // } catch (error) {
//     //   const errorMessage = error?.data?.message || 'An error occurred';
//     //   showErrorToast(errorMessage);
//     //   console.error('Error submitting form:', error);
//     // } finally {
//     //   setLoading(false);
//     // }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-center text-xl font-medium text-gray-700">
//             Change Email
//           </DialogTitle>
//         </DialogHeader>
//         <FormWrapper onSubmit={handleSubmit}>
//           <div className="py-4 space-y-6">
//             <div className="space-y-2">
//               <label htmlFor="newEmail" className="text-gray-700">
//                 New Email
//               </label>
//               <TextInput
//                 name="newEmail"
//                 type="email"
//                 placeholder="yournewemail@example.com"
//                 required
//               />
//             </div>
//           </div>

//           <DialogFooter className="flex sm:justify-between">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-teal-500 hover:bg-teal-600"
//               disabled={loading}
//             >
//               {loading ? 'Sending...' : 'Send Verification'}
//             </Button>
//           </DialogFooter>
//         </FormWrapper>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ChangeEmail;




'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TextInput from '@/components/form/TextInput';
import FormWrapper from '@/components/form/FromWrapper';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRequestEmailChangeMutation,
} from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

const ChangeEmail = ({ open, setOpen }) => {
  const [step, setStep] = useState(1); // 1: OTP, 2: Verify, 3: Change email
  const [loading, setLoading] = useState(false);

//   const [sendOtp] = useSendOtpMutation();
//   const [verifyOtp] = useVerifyOtpMutation();
//   const [requestEmailChange] = useRequestEmailChangeMutation();

  // Step 1: Send OTP automatically when modal opens
//   useEffect(() => {
//     if (open) {
//       (async () => {
//         try {
//           setLoading(true);
//           const res = await sendOtp().unwrap();
//           if (res?.success) {
//             showSuccessToast(res?.message || 'OTP sent to your email');
//             setStep(2);
//           }
//         } catch (error) {
//           showErrorToast(error?.data?.message || 'Failed to send OTP');
//         } finally {
//           setLoading(false);
//         }
//       })();
//     } else {
//       setStep(1);
//     }
//   }, [open]);

  // Step 2: Verify OTP
//   const handleVerifyOtp = async (data) => {
//     try {
//       setLoading(true);
//       const res = await verifyOtp(data).unwrap();
//       if (res?.success) {
//         showSuccessToast(res?.message || 'OTP verified successfully');
//         setStep(3);
//       }
//     } catch (error) {
//       showErrorToast(error?.data?.message || 'Invalid OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

  // Step 3: Change Email
//   const handleChangeEmail = async (data) => {
//     try {
//       setLoading(true);
//       const res = await requestEmailChange(data).unwrap();
//       if (res?.success) {
//         showSuccessToast(res?.message || 'Email changed successfully');
//         setOpen(false);
//       }
//     } catch (error) {
//       showErrorToast(error?.data?.message || 'Failed to change email');
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium text-gray-700">
            Change Email
          </DialogTitle>
        </DialogHeader>

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <FormWrapper onSubmit={handleVerifyOtp}>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-gray-700">
                  Enter OTP
                </label>
                <TextInput
                  name="otp"
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </DialogFooter>
          </FormWrapper>
        )}

        {/* Step 3: Change Email Input */}
        {step === 3 && (
          <FormWrapper onSubmit={handleChangeEmail}>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <label htmlFor="newEmail" className="text-gray-700">
                  New Email
                </label>
                <TextInput
                  name="newEmail"
                  type="email"
                  placeholder="yournewemail@example.com"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600" disabled={loading}>
                {loading ? 'Updating...' : 'Change Email'}
              </Button>
            </DialogFooter>
          </FormWrapper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
