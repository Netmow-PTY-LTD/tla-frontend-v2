import React from 'react';
import SettingsTabs from './_components/SettingTab';

const SettingsLayout = ({ children }) => {
  return (
    <div className="rounded-lg p-4">
      <SettingsTabs />
      {children}
    </div>
  );
};

export default SettingsLayout;
