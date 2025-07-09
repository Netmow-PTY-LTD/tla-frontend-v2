

import { Modal } from '@/components/UIComponents/Modal'
import React from 'react'

export default function SendMailModal({openMail, setOpenMail}) {
    return (
        <div>
            <Modal
            open={openMail}
            onOpenChange={setOpenMail}
            >
                <h1>Test modal</h1>
            </Modal>
        </div>
    )
}
