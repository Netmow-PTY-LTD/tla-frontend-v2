"use client"

import FormWrapper from '@/components/form/FromWrapper';
import TextareaInput from '@/components/form/TextArea';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/UIComponents/Modal'
import { useContactLeadMutation } from '@/store/features/lawyer/ResponseApiService';
import React from 'react'
import { toast } from 'sonner';

export default function SendMailModal({ openMail, setOpenMail, info }) {
    const [sendemail] = useContactLeadMutation()
    const lead = info?.leadId?.userProfileId;

    const onSubmit = async (data) => {
        console.log('data', data)
        try {
            const emailContactPayload = {
                method: 'email',
                toEmail: info?.leadId?.userProfileId?.user?.email,
                subject: "You're being contacted about your request",
                emailText: data?.email,
                leadId: info?.leadId?._id,
                responseId: info?._id,
            };
            const sendMailResult = await sendemail(emailContactPayload).unwrap()
            console.log("sendMailResult", sendMailResult)
            if(sendMailResult.success){
                toast.success(sendMailResult?.message)
            }

        } catch (error) {

        }
    }

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
                            Send Mail
                        </Button>
                    </div>
                </FormWrapper>
            </Modal>
        </div>
    )
}
