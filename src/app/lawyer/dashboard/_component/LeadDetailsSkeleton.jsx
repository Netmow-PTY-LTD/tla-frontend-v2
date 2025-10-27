import { Skeleton } from '@/components/ui/skeleton';
import { MoveLeft } from 'lucide-react';

export default function LeadDetailsSkeleton() {
  return (
    <div className="bg-white rounded-lg p-5    ">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button className="flex py-2 items-center gap-2">
          <MoveLeft className="text-gray-400 w-4 h-4" />
          <Skeleton className="h-5 w-28" />
        </button>
      </div>

      {/* User section */}
      <div className="mt-3 max-w-4xl">
        <div className="flex justify-between">
          <div className="flex flex-col items-start gap-4">
            <Skeleton className="rounded-full w-20 h-20" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>

        <hr className="border-[#F3F3F3] my-5" />

        {/* Contact Info */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-56" />
        </div>

        {/* Progress bar */}
        <Skeleton className="h-3 w-full rounded-full mt-4" />

        {/* Credit badge */}
        <div className="flex flex-wrap items-center gap-4 bg-[#f9f9f9] px-4 py-3 mt-6 mb-6 rounded-md w-max">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <hr className="border-[#F3F3F3] my-5" />

        {/* Service Description */}
        <div className="p-3 bg-[#F3F3F3] rounded-lg">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>

        <hr className="border-[#F3F3F3] my-5" />

        {/* Location */}
        <div>
          <Skeleton className="h-6 w-32 mb-3" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>

        <hr className="border-[#F3F3F3] my-5" />

        {/* Answered Questions */}
        <div className="mt-5 space-y-4">
          <Skeleton className="h-6 w-2/3 mb-2" />
          {[1, 2].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
