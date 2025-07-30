

import FormWrapper from '@/components/form/FromWrapper'
import TextareaInput from '@/components/form/TextArea'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/UIComponents/Modal'
import { useContactLeadMutation } from '@/store/features/lawyer/ResponseApiService'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function SendSmsModalClient({ openSms, setOpenSms, info }) {
    const [sendSMS,{isLoading}] = useContactLeadMutation()
    const lead = info?.leadId?.userProfileId;
    const onSubmit = async (data) => {
        try {
            if (!data?.message?.trim()) {
                toast.error('Message is required to send SMS');
                return;
            }

            const toPhone = info?.responseBy?.phone;
            const leadId = info?.leadId?._id;
            const responseId = info?._id;

            if (!toPhone || !leadId || !responseId) {
                toast.error('Missing lead/contact information');
                return;
            }

            const smsPayload = {
                method: 'sms',
                toPhone,
                message: data.message.trim(),
                leadId,
                responseId,
            };

            const result = await sendSMS(smsPayload).unwrap();

            if (result?.success) {
                toast.success(result?.message || 'SMS sent successfully');
                setOpenSms(false)
            } else {
                toast.error(result?.message || 'Failed to send SMS');
            }
        } catch (error) {
            console.error('SMS send error:', error);
            toast.error(error?.data?.message || 'An error occurred while sending SMS');
        }
    };

    return (
        <div>
            <Modal
                open={openSms}
                onOpenChange={setOpenSms}
            >
                <FormWrapper onSubmit={onSubmit}  >
                    <div className="text-center max-w-[90%] mx-auto">
                        <h3 className="text-2xl mb-3 font-semibold text-gray-800">Send an SMS</h3>
                        <p className="text-gray-600">
                            We'll send your SMS to  {lead?.name} and send you any replies from them over email.
                        </p>
                    </div>

                    <div className="mt-6">
                        <TextareaInput
                            name="message"
                            placeholder="Write SMS here"
                            rows={6}
                            label="Message"
                        />
                    </div>

                    <div className="flex justify-center items-center">
                        <Button className="bg-[#34b7f1] mt-10 text-white">
                           
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                'Send SMS'
                            )}

                        </Button>
                    </div>
                </FormWrapper>

            </Modal>
        </div>
    )
}
