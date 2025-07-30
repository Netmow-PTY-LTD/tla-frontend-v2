import SendMailModal from '@/app/lawyer/dashboard/my-responses/_components/modal/SendMailModal';
import SendSmsModal from '@/app/lawyer/dashboard/my-responses/_components/modal/SendSmsModal';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import WhatsApp from '@/components/icon/WhatsApp';
import { Button } from '@/components/ui/button';
import { userDummyImage } from '@/data/data';
import { getCompactTimeAgo } from '@/helpers/formatTime';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import { useNotifications } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import {
  useActivityLogMutation,
  useGetSingleResponseQuery,
  useUpdateResponseStatusMutation,
} from '@/store/features/lawyer/ResponseApiService';
import {
  AtSign,
  BadgeCent,
  BadgeCheck,
  Bell,
  CalendarCheck,
  Edit,
  LogIn,
  Mail,
  MessageSquare,
  MoveLeft,
  PhoneCall,
  PhoneOutgoing,
  PlusCircle,
  Send,
  Tag,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

export default function LeadResponseDetails({ onBack, response }) {
  const [activeTab, setActiveTab] = useState('activity');
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMail, setOpenMail] = useState(false);
  const [openSms, setOpenSms] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  const { data: singleResponse, isLoading: isSingleResponseLoading, refetch } =
    useGetSingleResponseQuery(response?._id, {
      skip: !response?._id,
    });

  console.log('singleResponse in details', singleResponse);
  const currentStatus = singleResponse?.data?.status || 'Pending';

  useNotifications(currentUser?._id, (data) => {
    console.log("🔔 Notification:", data);
    if (data?.userId) {
      refetch()
    }

  });



  const [updateStatus] = useUpdateResponseStatusMutation();
  const [updateActivity] = useActivityLogMutation();

  const handleUpdateStatus = async (status) => {
    try {
      const statusData = {
        responseId: response?._id,
        data: { status },
      };

      const result = await updateStatus(statusData).unwrap();
      if (result.success) {
        showSuccessToast(result.message);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
    }
  };

  const groupedByDate = (() => {
    const logs = singleResponse?.data?.activity || [];

    return logs.reduce((acc, log) => {
      const dateKey = new Date(log.date).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(log);
      return acc;
    }, {});
  })();

  const groupedLogsArray = Object.entries(groupedByDate).map(
    ([date, logs]) => ({
      date,
      logs, // no sorting applied
    })
  );

  const generateActivityIcon = (type) => {
    const iconStyles = {
      login: { Icon: LogIn, fill: '#3B82F6' }, // Blue
      update: { Icon: Edit, fill: '#F59E0B' }, // Amber/Yellow
      delete: { Icon: Trash2, fill: '#EF4444' }, // Red
      create: { Icon: PlusCircle, fill: '#10B981' }, // Green
      schedule: { Icon: CalendarCheck, fill: '#6366F1' }, // Indigo
      sendsms: { Icon: Send, fill: '#0EA5E9' }, // Sky blue
      contact: { Icon: PhoneCall, fill: '#8B5CF6' }, // Violet
      sendemail: { Icon: Mail, fill: '#2563EB' }, // Blue
      whatsapp: { Icon: WhatsApp, fill: '#25D366' }, // WhatsApp green
      status: { Icon: BadgeCheck, fill: '#22C55E' }, // Success green
      other: { Icon: Bell, fill: '#6B7280' }, // Gray
    };

    const { Icon, fill } = iconStyles[type] || iconStyles.other;

    return <Icon className="w-5 h-5" fill={fill} />;
  };

  const handleActivity = async (type) => {
    if (type === 'whatsapp') {
      const whatsappActivityPayload = {
        activityNote: 'You tried to contact via WhatsApp',
        activityType: 'whatsapp',
        module: 'response',
        objectId: response?._id,
        extraField: {
          fieldChanged: 'avatar',
        },
      };

      try {
        const result = await updateActivity(whatsappActivityPayload).unwrap();

        if (result.success) {
          const phone = singleResponse?.data?.responseBy?.phone;
          window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=`,
            '_blank'
          );
        }
      } catch (error) { }
    }
    if (type === 'sendemail') {
      setOpenMail(true);
      return;
    }
    if (type === 'sendsms') {
      setOpenSms(true);
      return;
    }
    if (type === 'Sendestimate') {
    }
  };

  if (isSingleResponseLoading) return <ResponseSkeleton />;
  return (
    <>
      <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
        <div className="max-w-[900px]">
          <div className="flex items-center justify-between">
            <button className="flex py-2 items-center gap-2" onClick={onBack}>
              {' '}
              <MoveLeft /> <span>Back to All</span>
            </button>
          </div>
          <div className="mt-3 mb-4 flex items-center justify-between bg-[#F5F6F9] rounded-lg py-2 px-4">
            <span className="text-gray-500 text-[13px]">
              Last activity{' '}
              {getCompactTimeAgo(singleResponse?.data?.activity[0]?.updatedAt)}
            </span>
            <div className="flex items-center gap-2">
              <b className="text-black text-[14px]">Current Status:</b>
              <select
                className="p-2 border border-gray-300 rounded-lg bg-white text-[13px]"
                defaultValue={currentStatus}
                onChange={(e) => handleUpdateStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="hired">Hired</option>
                <option value="archive">Archive</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex flex-col items-start gap-4 ">
              <figure className="w-20 h-20 overflow-hidden border rounded-full">
                <Image
                  src={
                    singleResponse?.data?.responseBy?.profilePicture ??
                    userDummyImage
                  }
                  alt={singleResponse?.data?.responseBy?.name || ''}
                  width={80}
                  height={80}
                  priority
                  className="w-full h-full rounded-full object-cover"
                />
              </figure>
              <div>
                <h2 className="font-medium heading-md">
                  {singleResponse?.data?.responseBy?.name}
                </h2>
                <p className="text-gray-500 mt-2">
                  {singleResponse?.data?.responseBy?.address}
                </p>
              </div>
            </div>
            {/* Current Status */}

            <hr className="my-3  " />
            <div className="mb-4">
              <div className="flex items-center gap-2 admin-text font-medium">
                <PhoneOutgoing className="w-5 h-5" />{' '}
                <span>
                  Phone: {singleResponse?.data?.responseBy?.phone || ''}
                </span>{' '}
              </div>
              <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
                <AtSign className="w-5 h-5" />{' '}
                <span>
                  Email: {singleResponse?.data?.responseBy?.user?.email || ''}
                </span>{' '}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* <Button className="bg-[#00C3C0]">
                        <Phone />
                        Show Number
                      </Button> */}
              <Button
                onClick={() => handleActivity('whatsapp')}
                className="bg-[#25D366]"
              >
                <WhatsApp />
                Send Whatsapp
              </Button>
              <Button
                onClick={() => handleActivity('sendemail')}
                className="bg-[#4285F4]"
              >
                <Mail />
                Send Email
              </Button>
              <Button
                onClick={() => handleActivity('sendsms')}
                className="bg-[#34B7F1]"
              >
                <MessageSquare />
                Send SMS
              </Button>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <Tag />
              <span className="admin-text font-medium">
                Your estimate:{' '}
                <Link href="#" className="underline">
                  <button
                    className="text-[#ff8602]"
                    onClick={() => handleActivity('Sendestimate')}
                  >
                    Send an estimate
                  </button>
                </Link>
              </span>
            </div>
            <hr className="w-full mt-5" />
            {response?.responseBy?.serviceIds?.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 mt-3">
                {response?.responseBy?.serviceIds?.map((service, i) => (
                  <span
                    key={i}
                    className="inline-flex justify-center items-center gap-2 rounded-[30px] bg-[#F3F3F3] px-2 py-1.5 text-[13px]"
                  >
                    {service?.name}
                  </span>
                ))}
              </div>
            )}
            <hr className="w-full mt-5" />
            <div className="flex w-full flex-col gap-4 mt-5">
              <div className="flex border-b border-gray-200 gap-6">
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`relative pb-2 text-gray-600 font-normal transition-colors ${activeTab === 'activity'
                    ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-black'
                    : 'hover:text-black'
                    }`}
                >
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === 'activity' && (
                  <div className="bg-white rounded-lg relative">
                    {groupedLogsArray?.map((activity, index) => {
                      const parts = new Intl.DateTimeFormat('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      }).formatToParts(new Date(activity.date));

                      const formattedDate = parts
                        .filter(({ type }) =>
                          ['weekday', 'day', 'month'].includes(type)
                        )
                        .map(({ value }) => value)
                        .join(' ');

                      return (
                        <Fragment key={index}>
                          <div
                            className={`activity-log-date-item text-sm font-medium text-gray-500 pb-2 text-center ml-[16px] ${index === 0 ? '' : 'border-l border-[#e6e7ec]'
                              }`}
                          >
                            {formattedDate}
                          </div>
                          {activity?.logs?.map((item, i) => {
                            return (
                              <div
                                className={`activity-log-item flex gap-2 ${index === 0 && i === 0 ? 'first-log-item' : ''
                                  }`}
                                key={i}
                              >
                                <div className="left-track flex-grow-0 flex flex-col w-[32px] items-center">
                                  <div
                                    className={`line-top h-1/2 w-[1] border-l border-[#e6e7ec]`}
                                  ></div>
                                  <div className="icon-wrapper mt-[-16px]">
                                    <div className="icon w-[32px] h-[32px] bg-[#000] rounded-full flex justify-center items-center">
                                      {item?.activityType &&
                                        generateActivityIcon(
                                          item?.activityType
                                        )}
                                    </div>
                                  </div>
                                  <div className="line-bottom h-1/2 w-[1] border-l border-[#e6e7ec]"></div>
                                </div>
                                <div className="flex-1 flex items-start justify-between mb-4 py-3 px-4 rounded-lg border border-gray-200">
                                  <div className="flex flex-col">
                                    <div className="text-gray-500">
                                      {item?.createdBy?.profile?.name || ''}
                                    </div>
                                    <div className="text-sm text-black font-medium">
                                      {item?.activityNote}
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {new Date(item?.date)
                                      .toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                      })
                                      .replace(/ (AM|PM)/, '')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendMailModal
        info={singleResponse?.data}
        openMail={openMail}
        setOpenMail={setOpenMail}
      />
      <SendSmsModal
        info={singleResponse?.data}
        openSms={openSms}
        setOpenSms={setOpenSms}
      />
    </>
  );
}
