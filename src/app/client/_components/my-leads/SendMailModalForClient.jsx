"use client"

import { showSuccessToast } from '@/components/common/toasts';
import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal'

import { useContactLeadMutation } from '@/store/features/lawyer/ResponseApiService';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

export default function SendMailModalForClient({ openMail, setOpenMail, info }) {
    const [sendemail, { isLoading }] = useContactLeadMutation()
    const lead = info?.leadId?.userProfileId;



    const onSubmit = async (data) => {
        try {
            // const toEmail = info?.leadId?.userProfileId?.user?.email;
            const toEmail = info?.responseBy?.user?.email;
            const leadId = info?.leadId?._id;
            const responseId = info?._id;
            const emailText = data?.email?.trim();

            if (!emailText) {
                toast.error('Email message is required');
                return;
            }

            if (!toEmail || !leadId || !responseId) {
                toast.error('Missing recipient email or reference IDs');
                return;
            }

            const emailPayload = {
                method: 'email',
                toEmail,
                subject: "You're being contacted about your request",
                emailText,
                leadId,
                responseId,

            };

            const result = await sendemail(emailPayload).unwrap();
            if (result?.success) {

                console.log('result data ==>', result)
                toast.success(result.message || 'Email sent successfully');
                setOpenMail(false)
            } else {
                toast.error(result.message || 'Failed to send email');
            }
        } catch (error) {
            console.error('Email send error:', error);
            toast.error(error?.data?.message || 'An error occurred while sending the email');
        }
    };

    return (
        <div>
            <Modal
                open={openMail}
                onOpenChange={setOpenMail}
            >
                <FormWrapper onSubmit={onSubmit}  >
                    <div className="text-center max-w-[90%] mx-auto">
                        <h3 className="text-2xl mb-3 font-semibold text-gray-800">Send an Mail</h3>
                        <p className="text-gray-600">
                            We'll send your Mail to  {lead?.name} and send you any replies from them over email.
                        </p>
                    </div>

                    <div className="mt-6">
                        <TextareaInput
                            name="email"
                            placeholder="Write Mail here"
                            rows={6}
                            label="Mail"
                        />
                    </div>

                    <div className="flex justify-center items-center">
                        <Button className="bg-[#4285f4] mt-10 text-white">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                'Send Mail'
                            )}
                        </Button>
                    </div>
                </FormWrapper>
            </Modal>
        </div>
    )
}
