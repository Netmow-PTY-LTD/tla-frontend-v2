import { Skeleton } from '@/components/ui/skeleton';
import {
  MoveLeft,
  PhoneOutgoing,
  AtSign,
  WhatsApp,
  Mail,
  MessageSquare,
  Tag,
  BadgeCent,
} from 'lucide-react';

export default function ResponseSkeleton() {
  return (
    <div className="">
      <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
        <div className="flex items-center justify-between">
          <button className="flex py-2 items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </button>
        </div>

        <div className="mt-4 mb-8 flex items-center justify-between bg-[#F5F6F9] rounded-lg py-2 px-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="mt-3 max-w-4xl">
          <div className="flex flex-col items-start gap-4">
            <Skeleton className="rounded-full w-20 h-20" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>

          <hr className="border-[#F3F3F3] my-5" />

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-5 w-56" />
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
          </div>

          <hr className="border-[#F3F3F3] h-1 w-full mt-5" />

          <div className="mt-5">
            <Skeleton className="h-6 w-2/3 mb-3" />
            <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>

          <hr className="border-[#F3F3F3] h-1 w-full mt-5" />

          <div className="flex w-full flex-col gap-4 mt-5">
            <div className="flex border-b border-gray-200 gap-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="mt-4 space-y-4">
              {[1, 2].map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
