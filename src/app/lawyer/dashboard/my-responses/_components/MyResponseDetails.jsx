'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import { Button } from '@/components/ui/button';
import {
  ArrowDownToLine,
  AtSign,
  BadgeCent,
  BadgeCheck,
  CircleAlert,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  MoveLeft,
  Phone,
  PhoneOutgoing,
  Tag,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGetSingleResponseQuery } from '@/store/features/lawyer/ResponseApiService';

export default function MyResponseDetails({ onBack, response }) {
  const [activeTab, setActiveTab] = useState('activity');
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: singleResponse, isLoading: isSingleResponseLoading } =
    useGetSingleResponseQuery(response?._id);

  console.log('singleResponse', singleResponse);

  const fullText = `If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance. If you're facing a divorce, it's crucial to seek professional legal advice. Our consultations cover everything from asset division to child custody arrangements, ensuring you understand your rights and options. Let us help you navigate this challenging time with expert guidance.`;

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
  return (
    <div className="">
      <div className="bg-white rounded-lg p-5 border border-[#DCE2EA] shadow-lg">
        <div className="flex items-center justify-between">
          <button className="flex py-2 items-center gap-2" onClick={onBack}>
            {' '}
            <MoveLeft /> <span>Back to Responses</span>
          </button>
        </div>
        <div className="mt-3 max-w-4xl">
          <div className="flex flex-col items-start gap-4 ">
            <figure className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/assets/img/auth-step1.png"
                alt="John Doe"
                width={80}
                height={80}
                priority
                className="rounded-full object-cover"
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
            <Button className="bg-[#00C3C0]">
              <Phone />
              Show Number
            </Button>
            <Button className="bg-[#00C3C0]">
              <MessageSquare />
              Send Whatsapp
            </Button>
            <Button className="bg-[#00C3C0]">
              <Mail />
              Send Email
            </Button>
            <Button className="bg-[#00C3C0]">
              <MessageSquare />
              Show SMS
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
            <b>5 credits</b>
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
          <div className="flex w-full flex-col gap-6 mt-5">
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
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'activity' && <div>Activity</div>}
              {activeTab === 'lead-details' && <div>Lead Details</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
