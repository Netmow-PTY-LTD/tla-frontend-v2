"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateLeadMutation } from "@/store/features/lawyer/LeadsApiService";
import { Modal } from "@/components/UIComponents/Modal";

export default function LeadCloseModal({
    leadId,
    open,
    onOpenChange,
    defaultReason = "",
}) {
    const [reason, setReason] = useState(defaultReason || "");

    // RTK Query mutation hook
    const [updateLead, { isLoading }] = useUpdateLeadMutation();

    const handleSave = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason before closing the lead.");
            return;
        }

        try {
            const result = await updateLead({
                id: leadId,
                data: {
                    status: "closed",
                    leadClosedReason: reason,
                },
            }).unwrap();

            toast.success(result?.data?.message || "Lead closed successfully!");
            setReason("");
            onOpenChange(false);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to close the lead");
        }
    };

    return (
        <Modal
            title="Close Lead"
            description="Provide a reason for closing this lead"
            open={open}
            onOpenChange={onOpenChange}
            width="max-w-[500px]"
        >
            {/* <div className="space-y-4">
             
                <Textarea
                    placeholder="Enter the reason for closing this lead..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[120px]"
                />

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Closing..." : "Close Lead"}
                    </Button>
                </div>
            </div> */}

            <div className="space-y-6 p-4">
  {/* Title/Description (optional inside modal) */}
  <div className="space-y-1">
    <h3 className="text-lg font-semibold text-gray-900">Close Lead</h3>
    <p className="text-sm text-gray-500">Provide a reason for closing this lead.</p>
  </div>

  {/* Textarea for closing reason */}
  <Textarea
    placeholder="Enter the reason for closing this lead..."
    value={reason}
    onChange={(e) => setReason(e.target.value)}
    className="min-h-[140px] resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-[#00c3c0] focus:ring-1 focus:ring-[#00c3c0]/20 focus:outline-none transition-all duration-200"


  />

  {/* Optional character count */}
  <div className="text-right text-xs text-gray-400">{reason.length}/500</div>

  {/* Action buttons */}
  <div className="flex justify-end gap-3 pt-2">
    <Button
      variant="outline"
      onClick={() => onOpenChange(false)}
      disabled={isLoading}
      className="rounded-lg px-4 py-2 hover:bg-gray-100 transition-all duration-150"
    >
      Cancel
    </Button>
    <Button
      onClick={handleSave}
      disabled={isLoading || !reason.trim()}
      className="rounded-lg px-4 py-2 bg-[#00c3c0] text-white hover:bg-[#00c3c0] transition-all duration-150 flex items-center gap-2"
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          />
        </svg>
      )}
      {isLoading ? "Closing..." : "Close Lead"}
    </Button>
  </div>
</div>





        </Modal>
    );
}
