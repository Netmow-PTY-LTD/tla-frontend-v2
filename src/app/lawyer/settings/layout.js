import React from 'react';
import SettingsTabs from './_components/SettingTab';

const SettingsLayout = ({ children }) => {
  return (
    <div className=" border rounded-xl">
      <SettingsTabs />
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SettingsLayout;
