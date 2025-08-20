"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/UIComponents/Modal";

export function RequestMessageModal({ open, onOpenChange, handleRequest }) {
    const [message, setMessage] = useState("");
    const [requestCall, setRequestCall] = useState(false);

    const handleSend = () => {
        console.log({ message, requestCall });
        // Add API call here
        handleRequest(message)
        // onOpenChange(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            width="max-w-[500px]"
            height=""
            overlayBg="bg-black/50"
        >
            <div className="p-5 flex flex-col gap-4">


                <h2 className="text-lg font-semibold">Send a Request</h2>
                <p className="text-sm text-gray-600">
                    Add a message to increase your chances of getting a response
                </p>

                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="Tell them more about what you're looking for (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={200}
                />

                {/* Attachments and Quote */}
                <div className="flex flex-col gap-2 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                        <span>📎</span>
                        <span>Your job details attached</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>🏷️</span>
                        <span>Ask for a price or quote</span>
                    </div>
                </div>

                {/* Request a call */}
                <div className="flex items-center gap-2">
                    <Switch
                        checked={requestCall}
                        onCheckedChange={(checked) => setRequestCall(checked)}
                    />
                    <span className="text-sm text-gray-700">Request a call</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                    <Button
                        className="flex-1 bg-[#00c3c0] text-white transition duration-75 hover:bg-[#299e9c] hover:text-white"
                        onClick={handleSend}
                        disabled={message.trim().length === 0 && !requestCall}
                    >
                        Send message
                    </Button>

                </div>
            </div>
        </Modal>
    );
}
