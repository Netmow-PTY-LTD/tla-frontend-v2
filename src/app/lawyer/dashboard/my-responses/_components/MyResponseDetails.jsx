'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Button } from '@/components/ui/button';
import {
  AtSign,
  BadgeCent,
  BadgeCheck,
  BadgeX,
  Bell,
  CalendarCheck,
  Delete,
  Edit,
  Loader2,
  LogIn,
  Mail,
  MailCheck,
  MessageSquare,
  MoveLeft,
  Phone,
  PhoneCall,
  PhoneOutgoing,
  PlusCircle,
  Rss,
  Send,
  Tag,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  responseApiService,
  useActivityLogMutation,
  useGetSingleResponseQuery,
  useUpdateResponseStatusMutation,
} from '@/store/features/lawyer/ResponseApiService';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import WhatsApp from '@/components/icon/WhatsApp';
import ResponseSkeleton from './ResponseSkeleton';
import { showErrorToast, showSuccessToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';
import SendMailModal from './modal/SendMailModal';
import SendSmsModal from './modal/SendSmsModal';
import { getCompactTimeAgo } from '@/helpers/formatTime';
import { userDummyImage } from '@/data/data';
import { useDispatch, useSelector } from 'react-redux';
import { useNotifications } from '@/hooks/useSocketListener';
import { selectCurrentUser } from '@/store/features/auth/authSlice';

export default function MyResponseDetails({ onBack, response, responseId }) {
  const [activeTab, setActiveTab] = useState('activity');
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMail, setOpenMail] = useState(false);
  const [openSms, setOpenSms] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const {
    data: singleResponse,
    isLoading: isSingleResponseLoading,
    refetch,
  } = useGetSingleResponseQuery(responseId ? responseId : response?._id, {
    skip: !responseId && !response?._id,
  });

  const toUser = singleResponse?.data?.leadId?.userProfileId?.user?._id;

  useNotifications(currentUser?._id, (data) => {
    console.log('🔔 Notification:', data);
    if (data?.userId) {
      refetch();
    }
  });

  useNotifications(currentUser?._id, (data) => {
    console.log('🔔 Notification:', data);
    if (data?.userId) {
      refetch();
    }
  });

  const badge = singleResponse?.data?.leadId?.userProfileId?.profileType;

  const [updateStatus] = useUpdateResponseStatusMutation();
  const [updateActivity] = useActivityLogMutation();

  const router = useRouter();

  const fallbackText = `If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance.`;

  const additionalDetails = singleResponse?.data?.leadId?.additionalDetails;
  const fullText =
    additionalDetails && additionalDetails.trim() !== ''
      ? additionalDetails
      : fallbackText;

  const getTruncatedText = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const maxLength = 300;

  const shouldTruncate = fullText.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate
      ? fullText
      : getTruncatedText(fullText, maxLength);

  useEffect(() => {
    // Scroll to top of the window when this component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const mapUrl = getStaticMapUrl(singleResponse?.data?.responseBy?.address);

  const handleUpdateStatus = async (status) => {
    try {
      const statusData = {
        responseId: responseId || response?._id,
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

  const currentStatus = singleResponse?.data?.status || 'Pending';

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
  const generateActivityIcon = (type) => {
    const { Icon, fill } = iconStyles[type] || iconStyles.other;

    return <Icon className="w-5 h-5" stroke={'#fff'} />;
  };

  const handleActivity = async (type) => {
    if (type === 'whatsapp') {
      const whatsappActivityPayload = {
        toUser: toUser,
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
          const phone = response?.leadId?.userProfileId?.phone;
          window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=`,
            '_blank'
          );
        }
      } catch (error) {}
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

  // if (isSingleResponseLoading) {
  //   return <ResponseSkeleton />;
  // }

  return (
    <>
      {isSingleResponseLoading ? (
        <ResponseSkeleton />
      ) : (
        <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
          <div className="max-w-[900px]">
            <div className="flex items-center justify-between">
              <button className="flex py-2 items-center gap-2" onClick={onBack}>
                {' '}
                <MoveLeft /> <span>Back to Responses</span>
              </button>
            </div>
            <div className="mt-4 mb-6 flex items-center justify-between bg-[#F5F6F9] rounded-lg py-2 px-4">
              <span className="text-gray-500 text-[13px]">
                Last activity{' '}
                {getCompactTimeAgo(
                  singleResponse?.data?.activity[0]?.updatedAt
                )}
              </span>
              <div className="flex items-center gap-2">
                <b className="text-black text-[14px]">Current Status:</b>
                <select
                  className="p-2 border border-gray-300 rounded-lg bg-white text-[13px]"
                  value={currentStatus}
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
                      singleResponse?.data?.leadId?.userProfileId
                        ?.profilePicture || userDummyImage
                    }
                    alt={
                      singleResponse?.data?.leadId?.userProfileId?.name || ''
                    }
                    width={80}
                    height={80}
                    priority
                    className="w-full h-full rounded-full object-cover"
                  />
                </figure>

                <div>
                  <h2 className="font-medium heading-md">
                    {singleResponse?.data?.leadId?.userProfileId?.name}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {singleResponse?.data?.leadId?.userProfileId?.address}
                  </p>
                </div>
              </div>
              {/* Current Status */}

              <hr className="w-full my-5  " />
              <div className="mb-4">
                <div className="flex items-center gap-2 admin-text font-medium">
                  <PhoneOutgoing className="w-5 h-5" />{' '}
                  <span>
                    Phone:{' '}
                    {singleResponse?.data?.leadId?.userProfileId?.phone || ''}
                  </span>{' '}
                </div>
                <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
                  <AtSign className="w-5 h-5" />{' '}
                  <span>
                    Email:{' '}
                    {singleResponse?.data?.leadId?.userProfileId?.user?.email ||
                      ''}
                  </span>{' '}
                </div>
              </div>
              <div className="flex gap-2">
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
                {/* <Button
                  onClick={() => handleActivity('sendsms')}
                  className="bg-[#34B7F1]"
                >
                  <MessageSquare />
                  Send SMS
                </Button> */}
              </div>
              {/* <div className="mt-5 flex items-center gap-2">
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
              </div> */}
              <div className="mt-5 flex items-center gap-2">
                <BadgeCent />
                <b>
                  {' '}
                  {singleResponse?.data?.credit}{' '}
                  {singleResponse?.data?.credit > 1 ? 'credits' : 'credit'}{' '}
                </b>
              </div>
              <hr className="w-full mt-5" />
              <div className="mt-5">
                <h4 className="font-medium mb-1 heading-base">
                  Looking for a {singleResponse?.data?.serviceId?.name || ''}{' '}
                  consultation
                </h4>
                <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
                  <h5 className="font-medium mb-2 heading-base">
                    {singleResponse?.data?.serviceId?.name || ''}
                  </h5>
                  <div className="text-sm text-[#34495E] ">
                    {displayText}
                    {shouldTruncate && (
                      <button
                        onClick={toggleReadMore}
                        className="text-[var(--color-black)] font-semibold hover:underline focus:outline-none ml-2"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <hr className="w-full mt-5" />
              <div className="flex w-full flex-col gap-4 mt-5">
                <div className="flex border-b border-gray-200 gap-6">
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`relative pb-2 text-gray-600 font-normal transition-colors ${
                      activeTab === 'activity'
                        ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-black'
                        : 'hover:text-black'
                    }`}
                  >
                    Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('lead-details')}
                    className={`relative pb-2 text-gray-600 font-normal transition-colors ${
                      activeTab === 'lead-details'
                        ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-black'
                        : 'hover:text-black'
                    }`}
                  >
                    Lead Details
                  </button>
                  {/* <button
                  onClick={() => setActiveTab('note')}
                  className={`relative pb-2 text-gray-600 font-normal transition-colors ${
                    activeTab === 'note'
                      ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-black'
                      : 'hover:text-black'
                  }`}
                >
                  My Notes
                </button> */}
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
                              className={`activity-log-date-item text-sm font-medium text-gray-500 pb-2 text-center ml-[16px] ${
                                index === 0 ? '' : 'border-l border-[#e6e7ec]'
                              }`}
                            >
                              {formattedDate}
                            </div>
                            {activity?.logs?.map((item, i) => {
                              return (
                                <div
                                  className={`activity-log-item flex gap-2 ${
                                    index === 0 && i === 0
                                      ? 'first-log-item'
                                      : ''
                                  }`}
                                  key={i}
                                >
                                  <div className="left-track flex-grow-0 flex flex-col w-[32px] items-center">
                                    <div
                                      className={`line-top h-1/2 w-[1] border-l border-[#e6e7ec]`}
                                    ></div>
                                    <div className="icon-wrapper mt-[-16px]">
                                      <div className="icon w-[32px] h-[32px] bg-[#000] rounded-full flex justify-center items-center">
                                        {(() => {
                                          const iconStyle =
                                            iconStyles[item?.activityType] ||
                                            iconStyles.other;
                                          return (
                                            <div
                                              className="icon w-[32px] h-[32px] rounded-full flex justify-center items-center"
                                              style={{
                                                backgroundColor: iconStyle.fill,
                                              }}
                                            >
                                              {item?.activityType &&
                                                generateActivityIcon(
                                                  item?.activityType
                                                )}
                                            </div>
                                          );
                                        })()}
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
                            {/* <div className="relative">
                          {activity.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start justify-between mb-4 py-3 px-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex flex-col">
                                <div className="text-gray-500">{item.user}</div>
                                <div className="text-sm text-black font-medium">
                                  {item.action}
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {item.time}
                              </span>
                            </div>
                          ))}
                        </div> */}
                          </Fragment>
                        );
                      })}
                    </div>
                  )}
                  {activeTab === 'lead-details' && (
                    <div className="flex flex-col gap-5">
                      {singleResponse?.data?.leadAnswers?.map(
                        (leadAnswer, i) => (
                          <div key={i}>
                            <p className="text-[var(--color-special)] font-medium">
                              {leadAnswer?.question}
                            </p>
                            <div className="text-[#34495E] mt-2">
                              {leadAnswer?.options &&
                                leadAnswer?.options
                                  ?.map((option) => option?.option)
                                  .join(', ')}
                            </div>
                          </div>
                        )
                      )}
                      <div className="mt-5">
                        <img src={mapUrl} className="rounded-lg" alt="map" />
                      </div>
                    </div>
                  )}
                  {activeTab === 'note' && (
                    <div className="bg-white rounded-lg p-4">My Note</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
