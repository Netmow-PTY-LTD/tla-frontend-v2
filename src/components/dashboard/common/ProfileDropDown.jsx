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
import { logOut, selectCurrentUser } from '@/store/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthLogOutMutation } from '@/store/features/auth/authApiService';
import { useRouter } from 'next/navigation';

export default function ProfileDropDown({ data }) {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);

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
          <div className="flex items-center group gap-2">
            <Avatar>
              <AvatarImage src={userDummyImage} alt="user" />
              <AvatarFallback>USER</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium">
              {data?.username || 'User Name'}
            </span>
            <ChevronDown className="ml-auto" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>User Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href={`/client/dashboard`}>Switch to Client</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {currentUser?.role === 'admin' &&
            currentUser?.regUserType === 'admin' && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href={`/admin`}>Switch to Admin</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/lawyer/dashboard/my-stats">My Profile</Link>
              <DropdownMenuShortcut>
                <Settings />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/lawyer/settings">Settings</Link>
              <DropdownMenuShortcut>
                <Settings />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <div
              className="flex items-center justify-between w-full"
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
