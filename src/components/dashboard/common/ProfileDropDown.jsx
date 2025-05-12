'use client';
import React from 'react';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Cookies from 'js-cookie';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { userDummyImage } from '@/data/data';

const appEnvironment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT;

export default function ProfileDropDown() {
  // const userRoleFromCookies = Cookies.get('role')?.split('_').join('-');

  const userRoleFromCookies = Cookies.get('regUserType');

  const userType = userRoleFromCookies === 'seller' ? 'seller' : 'buyer';
  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center group gap-2">
            <Avatar>
              <AvatarImage src={userDummyImage} alt="user" />
              <AvatarFallback>USER</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium">User Name</span>
            <ChevronDown className="ml-auto" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>User Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`${
                  userType === 'seller'
                    ? '/seller/dashboard'
                    : '/buyer/dashboard'
                }`}
              >{`${
                userType === 'seller' ? 'Switch to Buyer' : 'Switch to Seller'
              }`}</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/seller/settings">Settings</Link>
              <DropdownMenuShortcut>
                <Settings />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <div
              className="flex items-center justify-between w-full"
              onClick={() => {
                Cookies.remove('token');
                Cookies.remove('role');

                const redirectUrl =
                  appEnvironment === 'development'
                    ? `${window.location.protocol}//localhost:3000/login`
                    : `${window.location.protocol}//${process.env.NEXT_PUBLIC_REDIRECT_URL}/login`;

                window.location.assign(redirectUrl);
              }}
            >
              <span>Log out</span>
              <DropdownMenuShortcut className="flex items-center">
                <LogOut />
              </DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
