"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Modal } from "@/components/UIComponents/Modal";

const ratingSchema = z.object({
  rating: z
    .number()
    .min(1, "Please provide at least 1 star")
    .max(5, "Maximum is 5 stars"),
  feedback: z
    .string()
    .max(300, "Feedback should not exceed 300 characters")
    .optional(),
});



export default function RatingForm() {
  const [open, setOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ratingSchema),
    defaultValues: { rating: 0, feedback: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (data) => {
    console.log("Rating submitted:", data);
    setOpen(false);
  };

  return (
    <>
      <button onClick={()=> setOpen(true)}  className="text-blue-500">
        Rate to lawyer
      </button>
      <Modal
        title="Rate Your Experience"
        open={open}
        onOpenChange={setOpen}
        width="max-w-[450px]"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-4"
        >
          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setValue("rating", star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="transition-transform transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 cursor-pointer ${(hoveredStar ?? rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                    }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm text-center">
              {errors.rating.message}
            </p>
          )}

          {/* Feedback */}
          <div>
            <Textarea
              {...register("feedback")}
              placeholder="Write your feedback (optional)..."
              className="resize-none"
              rows={4}
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">
                {errors.feedback.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </form>
      </Modal>

    </>
  );
}
