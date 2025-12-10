
'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown, LogOut, SendToBack, Settings, Briefcase, LayoutDashboard, Users } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { userDummyImage } from '@/data/data';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAuthLogOutMutation } from '@/store/features/auth/authApiService';
import { logOut } from '@/store/features/auth/authSlice';
import { disconnectSocket } from '@/lib/socket';
import { Skeleton } from '@/components/ui/skeleton';
import { baseApi } from '@/store/baseApi/baseApi';

export default function MarketingProfileDropDown({ data, isCurrentUserLoading }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (typeof window === 'undefined') return null; // SSR-safe

  const [authLogout] = useAuthLogOutMutation();

  const handleLogout = async () => {
    try {
      disconnectSocket();
      await authLogout().unwrap();
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    dispatch(logOut());
    dispatch(baseApi.util.resetApiState());
    router.push('/login');
  };

  if (!isClient) return null;

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCurrentUserLoading ? (
            <div className="flex items-center group gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-16" />
            </div>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={data?.profile?.profilePicture ?? userDummyImage}
                  alt={data?.profile?.name || 'User'}
                />
                <AvatarFallback>USER</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">
                {data?.profile?.name.split(' ')[0] || 'User'}
              </span>
              <ChevronDown className="w-5 h-5" />
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60 z-[999]" portalled={false} sideOffset={8} align="start">
          <DropdownMenuLabel>Switch Dashboard</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Role Switches */}
          <DropdownMenuGroup>
            
            {/* <DropdownMenuItem>
              <Link href="/marketing/my-profile" className="w-full flex items-center justify-between px-2 py-1.5">
                <span>My Profile</span>
                <DropdownMenuShortcut>
                  <LayoutDashboard />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem> */}
           
           
          </DropdownMenuGroup>
          <DropdownMenuGroup>

            {
              data?.regUserType === 'admin' &&
               <DropdownMenuItem>
              <Link href="/admin" className="w-full flex items-center justify-between px-2 py-1.5">
                <span>Switch to Admin</span>
                <DropdownMenuShortcut>
                  <LayoutDashboard />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            }
            
           
           
           
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="#" className="w-full flex items-center justify-between px-2 py-1.5">
                <span>Settings</span>
                <DropdownMenuShortcut>
                  <Settings />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem onClick={handleLogout}>
            <div className="flex items-center justify-between w-full px-2 py-1.5 cursor-pointer">
              <span>Log Out</span>
              <DropdownMenuShortcut>
                <LogOut />
              </DropdownMenuShortcut>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
