

import { Modal } from '@/components/UIComponents/Modal'
import React from 'react'

export default function SendSmsModal({openSms, setOpenSms}) {
    return (
        <div>
            <Modal
            open={openSms}
            onOpenChange={setOpenSms}
            >
                <h1>Test modal</h1>
            </Modal>
        </div>
    )
}
