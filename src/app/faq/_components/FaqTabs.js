'use client';

import { useState } from 'react';
import Faqs from './Faqs';

export default function FaqTabs({ clientsData, lawyersData, generalData = [] }) {
  const [activeTab, setActiveTab] = useState('clients');

  const tabs = [
    // { id: 'general', label: 'General', data: generalData },
    { id: 'clients', label: 'For Clients', data: clientsData },
    { id: 'lawyers', label: 'For Lawyers', data: lawyersData },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 my-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-lg font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id}>
                <Faqs data={tab.data} />
              </div>
            )
        )}
      </div>
    </div>
  );
}
