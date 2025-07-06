'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Button } from '@/components/ui/button';
import {
  AtSign,
  BadgeCent,
  Loader2,
  Mail,
  MessageSquare,
  MoveLeft,
  Phone,
  PhoneOutgoing,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGetSingleResponseQuery } from '@/store/features/lawyer/ResponseApiService';
import { getStaticMapUrl } from '@/helpers/generateStaticMapUrl';
import WhatsApp from '@/components/icon/WhatsApp';
import ResponseSkeleton from './ResponseSkeleton';

export default function MyResponseDetails({ onBack, response, responseId }) {
  const [activeTab, setActiveTab] = useState('activity');
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: singleResponse, isLoading: isSingleResponseLoading } =
    useGetSingleResponseQuery(responseId ? responseId : response?._id);

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

  const mapUrl = getStaticMapUrl(
    singleResponse?.data?.leadId?.userProfileId?.address
  );

  if (isSingleResponseLoading) {
    return <ResponseSkeleton />;
  }

  const activities = [
    {
      date: 'Fri 23 May',
      items: [
        {
          user: 'You',
          action: 'Updated the status to pending',
          time: '17:01',
        },
        {
          user: 'You',
          action: 'Updated the status to hired',
          time: '17:01',
        },
      ],
    },
    {
      date: 'Fri 3 Jan',
      items: [
        {
          user: 'You',
          action: 'Set a reminder to call them back Fri 3 Jan at 08:47',
          time: '04:47',
        },
        {
          user: 'You',
          action: 'Called and spoke with Anita',
          time: '04:47',
        },
        {
          user: 'You',
          action: 'Purchased the lead',
          time: '04:45',
        },
      ],
    },
  ];

  const currentStatus = singleResponse?.data?.status || 'Pending';

  return (
    <div className="">
      <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
        <div className="flex items-center justify-between">
          <button className="flex py-2 items-center gap-2" onClick={onBack}>
            {' '}
            <MoveLeft /> <span>Back to Responses</span>
          </button>
        </div>
        <div className="mt-4 mb-8 flex items-center justify-between bg-[#F5F6F9] rounded-lg py-2 px-4">
          <span className="text-gray-500 text-[13px]">
            Last activity 1m ago
          </span>
          <div className="flex items-center gap-2">
            <b className="text-black text-[14px]">Current Status:</b>
            <select
              className="p-2 border border-gray-300 rounded-lg bg-white text-[13px]"
              defaultValue={currentStatus}
              onChange={(e) =>
                console.log('Status changed to:', e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>
        <div className="mt-3 max-w-4xl">
          <div className="flex flex-col items-start gap-4 ">
            <figure className="w-20 h-20 overflow-hidden">
              <Image
                src={
                  singleResponse?.data?.leadId?.userProfileId?.profilePicture ||
                  '/assets/img/auth-step1.png'
                }
                alt="John Doe"
                width={80}
                height={80}
                priority
                className="w-full h-full rounded-full object-cover"
              />
            </figure>
            <div>
              <h2 className="font-medium heading-md">
                {response?.leadId?.userProfileId?.name}
              </h2>
              <p className="text-gray-500 mt-2">
                {response?.leadId?.userProfileId?.address}
              </p>
            </div>
          </div>
          {/* Current Status */}

          <hr className="border-[#F3F3F3] my-5  " />
          <div className="mb-4">
            <div className="flex items-center gap-2 admin-text font-medium">
              <PhoneOutgoing className="w-5 h-5" />{' '}
              <span>Phone: {response?.leadId?.userProfileId?.phone}</span>{' '}
            </div>
            <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
              <AtSign className="w-5 h-5" />{' '}
              <span>Email: {response?.leadId?.userProfileId?.user?.email}</span>{' '}
            </div>
          </div>
          <div className="flex gap-2">
            {/* <Button className="bg-[#00C3C0]">
              <Phone />
              Show Number
            </Button> */}
            <Button className="bg-[#25D366]">
              <WhatsApp />
              Send Whatsapp
            </Button>
            <Button className="bg-[#4285F4]">
              <Mail />
              Send Email
            </Button>
            <Button className="bg-[#34B7F1]">
              <MessageSquare />
              Send SMS
            </Button>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Tag />
            <span className="admin-text font-medium">
              Your estimate:{' '}
              <Link href="#" className="underline">
                Send an estimate
              </Link>
            </span>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <BadgeCent />
            <b>
              {' '}
              {singleResponse?.data?.credit}{' '}
              {singleResponse?.data?.credit > 1 ? 'credits' : 'credit'}{' '}
            </b>
          </div>
          <hr className="border-[#F3F3F3] h-1 w-full mt-5" />
          <div className="mt-5">
            <h4 className="font-medium mb-1 heading-base">
              Looking for a {response?.serviceId?.name || ''} consultation
            </h4>
            <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
              <h5 className="font-medium mb-2 heading-base">
                {response?.serviceId?.name || ''}
              </h5>
              <div className="admin-text text-[#34495E] ">
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
          <hr className="border-[#F3F3F3] h-1 w-full mt-5" />
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
              <button
                onClick={() => setActiveTab('note')}
                className={`relative pb-2 text-gray-600 font-normal transition-colors ${
                  activeTab === 'note'
                    ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-black'
                    : 'hover:text-black'
                }`}
              >
                My Notes
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'activity' && (
                <div className="bg-white rounded-lg">
                  {activities.map((activity, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-base font-semibold text-gray-500 mb-2 text-center">
                        {activity.date}
                      </h3>
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
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'lead-details' && (
                <div className="flex flex-col gap-5">
                  {singleResponse?.data?.leadAnswers?.map((leadAnswer, i) => (
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
                  ))}
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
  );
}
