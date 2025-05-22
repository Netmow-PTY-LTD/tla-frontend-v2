import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpenText, Camera, CloudUpload, UserRound } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import ChangePassword from '../../_components/ChangePassword';

const page = () => {
  return (
    <div className="max-w-[900px] mb-4">
      <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm  mx-auto">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <BookOpenText className="text-[#00C3C0] w-6 h-6" />{' '}
          <span>My Details</span>
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Keep your details updated so that professionals can get in touch. If
          you no longer require the service, please close the request.
        </p>

        <div>
          {/* Avatar + Upload */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
              <UserRound />
            </div>
            <div className="flex gap-2">
              <button className="w-24 h-[70px] border border-dashed border-gray-300 text-xs text-center p-2 rounded flex flex-col items-center">
                <CloudUpload className="text-[#00C3C0] w-6 h-6" />

                <span className="mt-2"> Upload photo</span>
              </button>
              <button className="w-24 h-[70px] border border-dashed border-gray-300 text-xs text-center p-2 rounded flex flex-col items-center">
                <Camera className="text-[#00C3C0] w-6 h-6" />
                <span className="mt-2">Open camera</span>
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid lg:grid-cols-2 gap-4 flex-1">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Md Forhad Sarkar"
                className="bg-white text-black placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </Label>
              <Input
                id="phone"
                placeholder="Telephone"
                className="bg-white text-black placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                placeholder="forhad.netmow@gmail.com"
                className="bg-white text-black placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="**********"
                className="bg-white text-black placeholder:text-gray-400"
              />

              <ChangePassword />
            </div>
          </div>
        </div>

        <Button className="bg-[#00C3C0] hover:bg-[#00b3b0] mt-5 lg:mt-1 ">
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default page;
