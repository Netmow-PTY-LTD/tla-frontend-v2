'use client';
import TagButton from '@/components/dashboard/lawyer/components/TagButton';
import {
  ArrowDownToLine,
  AtSign,
  BadgeCheck,
  CircleAlert,
  FileText,
  MoveLeft,
  PhoneOutgoing,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function MyResponseDetails({ onBack, response }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
              <PhoneOutgoing />{' '}
              <span>Phone: {response?.leadId?.userProfileId?.phone}</span>{' '}
            </div>
            <div className=" flex items-center gap-2 mt-2 admin-text font-medium">
              <AtSign />{' '}
              <span>Email: {response?.leadId?.userProfileId?.user?.email}</span>{' '}
            </div>
          </div>
          {/* <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="btn-default bg-[#00C3C0]">
              Contact {response.name}
            </button>
            <div className="text-[#34495E] ml-2 flex items-center gap-2">
              <span>49 Credits required</span>
              <CircleAlert />
            </div>
          </div> */}
          <div className="mt-5">
            <h4 className="font-medium mb-1 heading-base">Matched criteria</h4>
            <div className="flex flex-wrap gap-2">
              <TagButton
                text="Urgent"
                bgColor="#FF86021A"
                icon={<Zap className="text-[#FF8602]" />}
              />
              <TagButton
                text="Separation Law"
                bgColor="#004DA61A"
                icon={<BadgeCheck className="text-[#00C3C0] " />}
              />
              <TagButton text="Criminal Law" bgColor="#A600161A" />
            </div>
          </div>
          <hr className="border-[#F3F3F3] h-1 w-full mt-5" />
          <div className="mt-5">
            <h4 className="font-medium mb-1 heading-base">
              Looking for a divorce law consultation
            </h4>
            <div className="p-3 bg-[#F3F3F3] mt-3 rounded-lg">
              <h5 className="font-medium mb-2 heading-base">
                Position Overview
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
          <div className="mt-5 space-y-3">
            <h4 className="font-medium heading-md mb-5">
              Answered some of selected questions
            </h4>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[#34495E]">
                  What kind of Law service you need?
                </p>
                <div className="font-medium text-black"> Family Law</div>
              </div>
              <div>
                <p className="text-[#34495E]">
                  What kind of Law service you need?
                </p>
                <div className="font-medium text-black"> Family Law</div>
              </div>
              <div>
                <p className="text-[#34495E]">
                  What kind of Law service you need?
                </p>
                <div className="font-medium text-black"> Family Law</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
