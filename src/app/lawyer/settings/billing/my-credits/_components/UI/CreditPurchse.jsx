'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { BrandIcon } from '@/assets/icon';

const CreditsPurchase = () => {
  const [autoTopup, setAutoTopup] = useState(false);

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My credits</h2>
        <p className="text-gray-600 mb-2">
          Credits are used to contact customers on LawApp. A small fee, paid in
          credits, is charged for each customer you contact. Learn more about
          credits and our charges in the{' '}
          <span className="text-[#00C3C0] hover:underline cursor-pointer">
            Help Centre
          </span>
          .
        </p>
        <p className="text-[#34495E] font-semibold mb-4">
          We charge a small fee for each customer you contact on Bark. Buy a
          pack of 50 credits and get 20% OFF
        </p>
      </div>

      <div className="border-0 bg-white rounded-lg shadow-sm pt-4 px-[17px] relative">
        <div className="bg-[#00C3C0] absolute text-white p-[10px] rounded-tl-md rounded-br-md text-sm font-medium top-0 left-0">
          20% OFF EXCLUSIVE STARTING PACK
        </div>

        <div className="mt-10">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex items-start space-x-4">
              <p className="font-medium text-gray-900">About 10 responses</p>
            </div>

            <div className="flex items-center space-x-2">
              <BrandIcon />
              <p className="font-medium text-gray-900">50 Credits</p>
            </div>

            <div>
              <p className="font-medium text-gray-900">
                $128.00{' '}
                <span className="text-gray-500 text-sm font-normal">
                  (ex GST)
                </span>
              </p>
              <p className="text-gray-500 text-sm">$2.56/credit</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Image
              src="/assets/img/Credits/guarantee.png"
              alt="Guarantee"
              width={160}
              height={160}
            />

            <div className="px-6 pb-6">
              <Button className="bg-[#12C7C4CC] hover:bg-teal-600 text-white px-8">
                Buy Now
              </Button>

              <div className="flex items-start space-x-2 mt-3">
                <Checkbox
                  id="auto-topup"
                  checked={autoTopup}
                  onCheckedChange={(checked) => setAutoTopup(!!checked)}
                  className="mt-1 text-[#00C3C0]"
                />
                <label
                  htmlFor="auto-topup"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Auto top-up next time
                </label>
              </div>
            </div>
          </div>

          <div className="w-full mt-6">
            <div className="w-[70%] mx-auto flex items-center space-x-2 bg-[#F9C01E33] rounded-t-md p-4">
              <Info className="h-5 w-5 text-[#00C3C0] flex-shrink-0" />
              <p className="text-sm text-gray-700">
                We'll give you your credits back if you don't secure at least
                one job on Bark using these credits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPurchase;
