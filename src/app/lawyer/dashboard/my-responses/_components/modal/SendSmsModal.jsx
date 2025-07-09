

import FormWrapper from '@/components/form/FromWrapper'
import TextareaInput from '@/components/form/TextArea'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/UIComponents/Modal'
import React from 'react'

export default function SendSmsModal({ openSms, setOpenSms, info }) {
    const onSubmit = (data) => {
        console.log('data', data)
    }
    const lead = info?.leadId?.userProfileId;

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
                            Send SMS
                        </Button>
                    </div>
                </FormWrapper>

            </Modal>
        </div>
    )
}
