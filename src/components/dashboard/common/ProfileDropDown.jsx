'use client';
import React from 'react';
import {
  BadgeCent,
  ChevronDown,
  Loader2,
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
import { useGetUserCreditStatsQuery } from '@/store/features/credit_and_payment/creditAndPaymentApiService';
import { disconnectSocket } from '@/lib/socket';
import { Skeleton } from '@/components/ui/skeleton';
import { baseApi } from '@/store/baseApi/baseApi';
import { LoaderSpinner } from '@/components/common/LoaderSpinner';
import { createPortal } from 'react-dom';

export default function ProfileDropDown() {
  const dispatch = useDispatch();

  /* -------------------------------------------------------------------------- */
  /*                               Hooks & State                                */
  /* -------------------------------------------------------------------------- */
  const token = useSelector((state) => state.auth.token);

  const { data: currentUser, isLoading } = useAuthUserInfoQuery(undefined, {
    skip: !token,
  });
  const isElitePro = currentUser?.data?.profile?.isElitePro;
  const eliteProId = currentUser?.data?.profile?.eliteProSubscriptionId;
  const subscriptionId = currentUser?.data?.profile?.subscriptionId;

  const { data } = useGetUserCreditStatsQuery(undefined, {
    skip: !token,
  });
  const creditStats = data?.data || {};
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                               Logout Logic                                 */
  /* -------------------------------------------------------------------------- */
  const [authLogout] = useAuthLogOutMutation();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Show loader immediately
    try {
      disconnectSocket();
      await authLogout().unwrap();
    } catch (error) {
      console.error("Logout API failed:", error);
    }
    // Redirect first to start navigation
    router.push('/login');


    // Clear redux state
    dispatch(logOut());
    dispatch(baseApi.util.resetApiState());

    // Note: We don't need to set isLoggingOut(false) because we are navigating away.
    // The loader will persist until the new page loads.

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
            {isLoading ? (
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
                    src={
                      currentUser?.data?.profile?.profilePicture ?? userDummyImage
                    }
                    alt={currentUser?.data?.profile?.name || 'Lawyer'}
                  />
                  <AvatarFallback>USER</AvatarFallback>
                </Avatar>
                <span className="font-medium text-[14px]">
                  {currentUser?.data?.profile?.name.split(' ')[0] || 'Lawyer'}
                </span>
                <ChevronDown className="w-5 h-5" />
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 z-[999]"
            portalled="false"
            sideOffset={8}
            align="start"
          >
            <DropdownMenuLabel>User Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 p-2 md:hidden">
              {/* Elite Pro */}
              {isElitePro === true && eliteProId && eliteProId !== null && (
                <span className="text-sm font-medium text-white bg-[var(--primary-color)] px-3 py-1 rounded-full w-8 h-8 flex items-center justify-center">
                  E
                </span>
              )}
              {subscriptionId && subscriptionId !== null && (
                <span className="text-sm font-medium text-white bg-[var(--secondary-color)] px-3 py-1 rounded-full w-8 h-8 flex items-center justify-center">
                  S
                </span>
              )}
            </div>
            <DropdownMenuSeparator className="block md:hidden" />

            <div className="p-2 w-full">
              <div className="flex items-center justify-between mb-1">
                <b>
                  {creditStats?.totalUsedCredits}/
                  {creditStats?.totalPurchasedCredits}
                </b>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-400 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${creditStats?.totalUsedCredits
                      ? (creditStats.totalUsedCredits /
                        creditStats.totalPurchasedCredits) *
                      100
                      : 0
                      }%`,
                  }}
                ></div>
              </div>
              <div className="mt-2 text-sm flex items-center gap-2">
                Available Credits:{' '}
                <b className="flex items-center gap-0.5">
                  <BadgeCent className="w-4 h-4" />
                  {creditStats?.remainingCredits}
                </b>
              </div>
            </div>

            <DropdownMenuSeparator />

            {currentUser?.data?.role === 'admin' &&
              currentUser?.data?.regUserType === 'admin' && (
                <>
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
            <DropdownMenuSeparator />
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
    </>
  );
}
