'use client';
import React from 'react';
import {
  ChevronDown,
  LogOut,
  SendToBack,
  Settings,
  UserIcon,
} from 'lucide-react';
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
import { logOut } from '@/store/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAuthLogOutMutation,
  useAuthUserInfoQuery,
} from '@/store/features/auth/authApiService';
import { useRouter } from 'next/navigation';

export default function ProfileDropDown() {
  const dispatch = useDispatch();

  const { data: currentUser } = useAuthUserInfoQuery();

  const router = useRouter();

  /**
   * Handles user logout functionality.
   * - Calls the authLogout mutation to invalidate the session on the server.
   * - Dispatches the logOut action to update the Redux store and clear user state.
   * - Redirects the user to the login page using the Next.js router.
   */
  const [authLogout] = useAuthLogOutMutation();
  const handleLogout = () => {
    authLogout();
    dispatch(logOut());
    Cookies.remove('token');
    router.push('/login');
  };
  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center group gap-[10px]">
            <Avatar>
              <AvatarImage
                src={
                  currentUser?.data?.profile?.profilePicture ?? userDummyImage
                }
                alt={currentUser?.data?.profile?.name || 'Lawyer'}
              />
              <AvatarFallback>USER</AvatarFallback>
            </Avatar>
            <span className="font-medium text-[14px]">
              {currentUser?.data?.profile?.name || 'Lawyer'}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 z-[999]"
          portalled="false"
          sideOffset={8}
          align="start"
        >
          <DropdownMenuLabel>User Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`/client/dashboard`}
                className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
              >
                <span>Switch to Client</span>
                <DropdownMenuShortcut>
                  <SendToBack />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {currentUser?.data?.role === 'admin' &&
            currentUser?.data?.regUserType === 'admin' && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href={`/admin`}
                      className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
                    >
                      <span>Switch to Admin</span>
                      <DropdownMenuShortcut>
                        <SendToBack />
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href="/lawyer/dashboard/my-stats"
                className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
              >
                <span>My Profile</span>
                <DropdownMenuShortcut>
                  <UserIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`/profile/${currentUser?.data?.profile?.slug}`}
                target="_blank"
                className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
              >
                <span>Public Profile</span>
                <DropdownMenuShortcut>
                  <UserIcon />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href="/lawyer/settings/profile"
                className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
              >
                <span>Settings</span>
                <DropdownMenuShortcut>
                  <Settings />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <div
              className="flex items-center justify-between w-full cursor-pointer px-2 py-1.5"
              onClick={handleLogout}
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
