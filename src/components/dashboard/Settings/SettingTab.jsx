'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsTabs({ tabs = [] }) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white rounded">
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap gap-4 p-4">
          {tabs?.map((tab, index) => {
            const isActive = pathname.startsWith(tab.href);

            return (
              <Link
                key={`${tab.href}-${index}`}
                href={tab.href}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
              ${
                isActive
                  ? 'bg-[#00C3C0] text-white'
                  : 'bg-[#EDF0F4] text-[#0B1C2D] hover:bg-gray-200'
              }
            `}
              >
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 text-xs bg-red-100 text-red-500 font-semibold px-1.5 py-0.5 rounded">
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
