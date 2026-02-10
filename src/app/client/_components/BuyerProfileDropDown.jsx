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
import { Loader2 } from 'lucide-react';

export default function BuyerProfileDropDown({ data }) {
  const dispatch = useDispatch();

  /* -------------------------------------------------------------------------- */
  /*                               Hooks & State                                */
  /* -------------------------------------------------------------------------- */
  const token = useSelector((state) => state.auth.token);

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useAuthUserInfoQuery(undefined, {
      skip: !token,
    });

  const router = useRouter();
  const [authLogout] = useAuthLogOutMutation();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  /**
   * Handles user logout functionality.
   * - Sets loading state to show overlay.
   * - Calls the authLogout mutation to invalidate the session on the server.
   * - Redirects the user to the login page.
   * - Dispatches the logOut action to update the Redux store and clear user state.
   */
  const handleLogout = async () => {
    setIsLoggingOut(true); // Show loader immediately
    try {
      disconnectSocket();
      await authLogout().unwrap(); // wait until the logout API finishes
    } catch (error) {
      console.error('Logout API failed:', error);
    }

    // Redirect first to start navigation
    router.push('/login');

    // Clear redux state
    dispatch(logOut());
    dispatch(baseApi.util.resetApiState());
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        </div>
      )}
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
    </>
  );
}
