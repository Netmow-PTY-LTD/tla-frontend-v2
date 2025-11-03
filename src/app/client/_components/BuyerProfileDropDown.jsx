'use client';
import React from 'react';
import { ChevronDown, LogOut, SendToBack, Settings } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentUser } from '@/store/features/auth/authSlice';
import { disconnectSocket } from '@/lib/socket';
import {
  useAuthLogOutMutation,
  useAuthUserInfoQuery,
} from '@/store/features/auth/authApiService';
import { Skeleton } from '@/components/ui/skeleton';
import Cookies from 'js-cookie';
import { persistor } from '@/store/store';
import { baseApi } from '@/store/baseApi/baseApi';

export default function BuyerProfileDropDown({ data }) {
  const dispatch = useDispatch();

  //const currentUser = useSelector(selectCurrentUser);

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useAuthUserInfoQuery();

  const router = useRouter();
  /**
   * Handles user logout functionality.
   * - Calls the authLogout mutation to invalidate the session on the server.
   * - Dispatches the logOut action to update the Redux store and clear user state.
   * - Redirects the user to the login page using the Next.js router.
   */
  const [authLogout] = useAuthLogOutMutation();
  const handleLogout = async () => {
    try {
      await authLogout().unwrap();
    } catch (error) {
      console.log(error);
    }
    disconnectSocket();
    dispatch(logOut());
    Cookies.remove('token');

    await persistor.purge();

    localStorage.clear();

    dispatch(baseApi.util.resetApiState());



    router.push('/login');
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCurrentUserLoading ? (
            <div className="flex items-center group gap-[5px]">
              <div className="w-10">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ) : (
            <div className="flex items-center group gap-[10px]">
              <Avatar>
                <AvatarImage
                  src={data?.profile?.profilePicture ?? userDummyImage}
                  alt={data?.profile?.name || 'Admin'}
                />
                <AvatarFallback>USER</AvatarFallback>
              </Avatar>
              <span className="font-medium text-[14px]">
                {data?.profile?.name.split(' ')[0] || 'Admin'}
              </span>
              <ChevronDown className="w-5 h-5" />
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 z-[999]"
          portalled={'false'}
          sideOffset={8}
          align="start"
        >
          <DropdownMenuLabel>User Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {currentUser?.data?.role === 'admin' &&
            currentUser?.data?.regUserType === 'admin' && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href={`/lawyer/dashboard`}
                      className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
                    >
                      <span>Switch to Lawyer</span>
                      <DropdownMenuShortcut>
                        <SendToBack />
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
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
                href="/client/account-settings/profile"
                className="w-full flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5"
              >
                <span> Account Settings</span>
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
