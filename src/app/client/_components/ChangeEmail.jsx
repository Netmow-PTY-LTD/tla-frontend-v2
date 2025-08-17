"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useChangeEmailMutation, useSendOtpMutation, useVerifyOtpMutation } from "@/store/features/auth/authApiService";
import { toast, Toaster } from "sonner";


export default function ChangeEmail({ open, setOpen }) {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserEmail = currentUser?.email;
  const userId = currentUser?._id;

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [email, setEmail] = useState(currentUserEmail); // current email

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
  const [changeEmail, { isLoading: changingEmail }] = useChangeEmailMutation();

  // Step 1 → Send OTP
  const handleSendOtp = async () => {
    try {
      const res = await sendOtp({ email }).unwrap();
      if (res.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Error sending OTP");
    }
  };

  // Step 2 → Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      if (res.success) {
        toast.success("OTP Verified!");
        setStep(3);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid OTP");
    }
  };

  // Step 3 → Change Email
  const handleConfirmEmail = async () => {
    if (!newEmail) {
      toast.error("Please enter a new email");
      return;
    }

    try {
      const res = await changeEmail({ userId, newEmail }).unwrap();
      if (res.success) {
        toast.success(`✅ Email changed to: ${res.data.email}`);
        setOpen(false);
        setStep(1);
        setOtp("");
        setNewEmail("");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change email");
    }
  };

  return (
    <>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Verify Email"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Enter New Email"}
            </DialogTitle>
          </DialogHeader>

          {/* Step 1 → Send OTP */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p>
                We will send an OTP to your current email: <b>{email}</b>
              </p>
              <Button onClick={handleSendOtp} disabled={sendingOtp}>
                {sendingOtp ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}

          {/* Step 2 → Verify OTP */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p>Enter the OTP sent to your email.</p>
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button onClick={handleVerifyOtp} disabled={verifyingOtp}>
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}

          {/* Step 3 → Change Email */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button onClick={handleConfirmEmail} disabled={changingEmail}>
                {changingEmail ? "Changing..." : "Confirm Email Change"}
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setStep(1);
                setOtp("");
                setNewEmail("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
