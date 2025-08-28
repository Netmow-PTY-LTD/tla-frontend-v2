'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Archive,
  CheckCircle,
  Circle,
  Clock,
  Eye,
  Loader,
  Loader2,
  MoreHorizontal,
  Pencil,
  Slash,
  Trash2,
  View,
} from 'lucide-react';
import { useAllUsersQuery } from '@/store/features/admin/userApiService';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserDetailsModal } from '../_components/UserDetailsModal';
import { useChangeUserAccountStatsMutation, useUpdateUserDataMutation, useUpdateUserDefalultPicMutation } from '@/store/features/auth/authApiService';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { UserDataTable } from '../_components/UserDataTable';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import resizeAndConvertToWebP from '@/components/UIComponents/resizeAndConvertToWebP';

// Enable relative time support
dayjs.extend(relativeTime);

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // state for selected lead

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [role, setRole] = useState();
  const [regUserType, setRegUserType] = useState('lawyer');
  const [accountStatus, setAccountStatus] = useState();
  const [isVerifiedAccount, setIsVerifiedAccount] = useState();
  const [isPhoneVerified, setIsPhoneVerified] = useState();

  // Pagination & sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data: userList, isFetching, refetch } = useAllUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    role,
    regUserType,
    accountStatus,
    isVerifiedAccount,
    isPhoneVerified,
    sortBy,
    sortOrder,
  });

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]);


  console.log('check user list', userList)
  const [changeAccoutStatus] = useChangeUserAccountStatsMutation();

  const handleChangeStatus = async (userId, status) => {
    try {
      const payload = {
        userId,
        data: { accountStatus: status },
      };

      const res = await changeAccoutStatus(payload).unwrap();

      if (res.success) {
        showSuccessToast(res?.message || 'Status Update Successful');
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'profile.name',
      accessorKey: 'profile.name',
      header: 'Name',
      cell: ({ row }) => {
        const profile = row.original.profile;
        return <div className="capitalize">{profile.name || 'N/A'}</div>;
      },
    },

    {
      id: 'profile.profilePicture',
      accessorKey: 'profile.profilePicture',
      header: 'Profile Picture',
      cell: ({ row }) => {
        const profile = row.original.profile;
        const [uploadProfilePicture, { isLoading }] = useUpdateUserDefalultPicMutation();
        console.log("profile.profilePicture", profile)
        const handleUpload = async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log('Upload image for:', profile, file);
            // Resize to max 500px width AND compress to WebP (quality 0.8)
            const webpFile = await resizeAndConvertToWebP(file, 500, 0.8);
            console.log('webpFile ===>',webpFile)
            try {
              const formData = new FormData();
              // Append the image file
              formData.append('file', webpFile);
              const payload = {
                userId: profile.user,
                data: formData,
              }

              // Call RTK Query mutation
           const res=   await uploadProfilePicture(payload).unwrap();
           if(res.success){
            refetch()

            console.log('Upload successful');
           }
              // Optionally, update row locally or refetch table
            } catch (err) {
              console.error('Upload failed', err);
            }
          }
        };

        return (
          <div className="flex items-center gap-2">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name || 'Profile'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <label className="px-2 py-1 bg-[#12C7C4] text-white text-xs rounded cursor-pointer hover:bg-[#0fa9a5]">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        );
      },
    },


    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },

    {
      accessorKey: 'accountStatus',
      header: 'Account Status',
      cell: ({ row }) => (
        <div className="capitalize text-center">
          {row.getValue('accountStatus')}
        </div>
      ),
    },
    {
      id: 'isVerifiedAccount',
      accessorKey: 'isVerifiedAccount',
      header: 'Email Verified',
      cell: ({ row }) => {
        const isVerifiedAccount = row.original?.isVerifiedAccount;
        return (
          <div className="capitalize">
            {isVerifiedAccount ? 'Verified Account' : 'Not Verified'}
          </div>
        );
      },
    },
    {
      id: 'serviceIds',
      accessorKey: 'serviceIds',
      header: 'Services',
      cell: ({ row }) => {
        const services = row.original?.profile?.serviceIds || []; // assuming array of service objects or names

        return (
          <div className="flex flex-wrap gap-1">
            {services.length > 0 ? (
              services.map((service, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize"
                >
                  {service?.name || service}{' '}
                  {/* use service.name if object, else string */}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs">No Services</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'profile.phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.original?.profile.phone || '-'}</div>,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => <div>{row.original?.profile.address || '-'}</div>,
    },
    {
      accessorKey: "isOnline",
      header: "Status",
      cell: ({ row }) => {
        const isOnline = row.original?.isOnline;

        return (
          <div className="flex items-center gap-2">
            <Circle
              size={12}
              className={isOnline ? "text-green-500" : "text-gray-400"}
              fill={isOnline ? "green" : "gray"}
            />
            <span className="text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "lastSeen",
      header: "Last Seen",
      cell: ({ row }) => {
        const isOnline = row.original?.isOnline;
        const lastSeen = row.original?.lastSeen;

        // If online, show "Now Online" instead of last seen time
        if (isOnline) {
          return <span className="text-green-500 font-semibold">Now Online</span>;
        }

        // If offline but no lastSeen value, fallback
        if (!lastSeen) {
          return <span className="text-gray-400">-</span>;
        }

        // Human-readable last seen time using dayjs
        return (
          <span className="text-gray-700">
            {dayjs(lastSeen).fromNow()} {/* e.g., "5 minutes ago" */}
          </span>
        );
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const userId = user._id; // Make sure _id exists in your data

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/user/edit/${userId}`}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/user/delete/${userId}`}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Trash2 />
                  Delete
                </Link>
              </DropdownMenuItem>
              {/* Details Page */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/user/${userId}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <View className="w-4 h-4" />
                  <span>View</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Change Status</DropdownMenuLabel>

              {[
                {
                  status: 'approved',
                  icon: <CheckCircle className="w-4 h-4" />,
                },
                { status: 'pending', icon: <Clock className="w-4 h-4" /> },
                { status: 'suspended', icon: <Slash className="w-4 h-4" /> },
                { status: 'archived', icon: <Archive className="w-4 h-4" /> },
              ].map(({ status, icon }) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleChangeStatus(userId, status)}
                  className="cursor-pointer capitalize"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{status}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Lawyer List </h1>
      <UserDataTable
        data={userList?.data || []}
        columns={columns}
        searchColumn="profile.name"
        page={page}
        setPage={setPage}
        totalPages={userList?.pagination?.totalPage || 1}
        isFetching={isFetching}
        search={search}
        setSearch={setSearch}
      />

      <UserDetailsModal
        data={selectedUser}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

// 'use client';
// import { DataTable } from '@/components/common/DataTable';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// import { Archive, CheckCircle, Clock, Eye, MoreHorizontal, Pencil, Slash, Trash2, View } from 'lucide-react';
// import { useAllUsersQuery } from '@/store/features/admin/userApiService';
// import React, { useState } from 'react';
// import Link from 'next/link';
// import { UserDetailsModal } from '../_components/UserDetailsModal';
// import { useChangeUserAccountStatsMutation } from '@/store/features/auth/authApiService';
// import { showErrorToast, showSuccessToast } from '@/components/common/toasts';

// export default function Page() {
//   const [open, setOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null); // state for selected lead
//   const { data: userList } = useAllUsersQuery();

//   console.log('user list =====>', userList)
//   const [changeAccoutStatus] = useChangeUserAccountStatsMutation();
//   const lawyerlist = userList?.data?.filter((lawyer) => lawyer.regUserType === "lawyer")

//   const handleChangeStatus = async (userId, status) => {
//     try {
//       const payload = {
//         userId,
//         data: { accountStatus: status }
//       }

//       const res = await changeAccoutStatus(payload).unwrap()

//       if (res.success) {
//         showSuccessToast(res?.message || 'Status Update Successful');
//       }

//     } catch (error) {
//       const errorMessage = error?.data?.message || 'An error occurred';
//       showErrorToast(errorMessage);
//     }

//   }

//   const columns = [
//     {
//       id: 'select',
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && 'indeterminate')
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       id: 'profile.name',
//       accessorKey: 'profile.name',
//       header: 'Name',
//       cell: ({ row }) => {
//         const profile = row.original.profile;
//         return <div className="capitalize">{profile.name || 'N/A'}</div>;
//       },
//     },
//     {
//       accessorKey: 'email',
//       header: 'Email',
//       cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
//     },
//     {
//       accessorKey: 'regUserType',
//       header: 'Type',
//       cell: ({ row }) => (
//         <div className="capitalize">{row.getValue('regUserType')}</div>
//       ),
//     },
//     {
//       accessorKey: 'accountStatus',
//       header: 'Account Status',
//       cell: ({ row }) => (
//         <div className="capitalize text-center">{row.getValue('accountStatus')}</div>
//       ),
//     },
//     {
//       id: 'isVerifiedAccount',
//       accessorKey: 'isVerifiedAccount',
//       header: 'Email Verified',
//       cell: ({ row }) => {
//         const isVerifiedAccount = row.original?.isVerifiedAccount
//         return (
//           <div className="capitalize">
//             {isVerifiedAccount ? "Verified Account" : "Not Verified"}
//           </div>
//         )
//       },
//     },
//     {
//       id: 'serviceIds',
//       accessorKey: 'serviceIds',
//       header: 'Services',
//       cell: ({ row }) => {
//         const services = row.original?.profile?.serviceIds || []; // assuming array of service objects or names

//         return (
//           <div className="flex flex-wrap gap-1">
//             {services.length > 0 ? (
//               services.map((service, index) => (
//                 <span
//                   key={index}
//                   className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize"
//                 >
//                   {service?.name || service} {/* use service.name if object, else string */}
//                 </span>
//               ))
//             ) : (
//               <span className="text-gray-400 text-xs">No Services</span>
//             )}
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: 'profile.phone',
//       header: 'Phone',
//       cell: ({ row }) => <div>{row.original?.profile.phone || '-'}</div>,
//     },
//     {
//       accessorKey: 'address',
//       header: 'Address',
//       cell: ({ row }) => (
//         <div>{row.original?.profile.address || '-'}</div>
//       ),
//     },
//     {
//       id: 'actions',
//       header: 'Actions',
//       enableHiding: false,
//       cell: ({ row }) => {
//         const user = row.original;
//         const userId = user._id; // Make sure _id exists in your data

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link
//                   href={`/admin/user/edit/${userId}`}
//                   className="flex gap-2 items-center cursor-pointer"
//                 >
//                   <Pencil />
//                   Edit
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link
//                   href={`/admin/user/delete/${userId}`}
//                   className="flex gap-2 items-center cursor-pointer"
//                 >
//                   <Trash2 />
//                   Delete
//                 </Link>
//               </DropdownMenuItem>
//               {/* Details Page */}
//               <DropdownMenuItem asChild>
//                 <Link href={`/admin/user/${userId}`} className="flex items-center gap-2 cursor-pointer">
//                   <View className="w-4 h-4" />
//                   <span>View</span>
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />

//               <DropdownMenuLabel>Change Status</DropdownMenuLabel>

//               {[
//                 { status: 'approved', icon: <CheckCircle className="w-4 h-4" /> },
//                 { status: 'pending', icon: <Clock className="w-4 h-4" /> },
//                 { status: 'suspended', icon: <Slash className="w-4 h-4" /> },
//                 { status: 'archived', icon: <Archive className="w-4 h-4" /> },
//               ].map(({ status, icon }) => (
//                 <DropdownMenuItem
//                   key={status}
//                   onClick={() => handleChangeStatus(userId, status)}
//                   className="cursor-pointer capitalize"
//                 >
//                   <div className="flex items-center gap-2">
//                     {icon}
//                     <span>{status}</span>
//                   </div>
//                 </DropdownMenuItem>
//               ))}

//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];

//   return (
//     <div>
//       <h1>Lawyer List Page</h1>
//       <DataTable
//         data={lawyerlist || []}
//         columns={columns}
//         searchColumn="profile.name"
//       />
//       <UserDetailsModal data={selectedUser} open={open}
//         onOpenChange={setOpen} />
//     </div>
//   );
// }
