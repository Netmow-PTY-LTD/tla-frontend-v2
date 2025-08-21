"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/UIComponents/Modal";

export function HireRequestMessageModal({
  open,
  onOpenChange,
  handleRequest,
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    handleRequest(message);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      width="max-w-[500px]"
      overlayBg="bg-black/50"
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">
          Send Hire Request
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-600">
          You're about to send a hire request to this lawyer.  
          Add a short message explaining why you’d like to hire them.  
          This will improve your chances of getting accepted.
        </p>

        {/* Message Box */}
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Write a personalized message to the lawyer (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={300}
        />

       
        
        {/* Info Note */}
        <p className="text-xs text-gray-500 mt-1">
          ⚡ Once you send the request, the lawyer will be notified instantly.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-[#00c3c0] text-white transition duration-150 hover:bg-[#299e9c]"
            onClick={handleSend}
            disabled={message.trim().length === 0 }
          >
            Send Hire Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}
