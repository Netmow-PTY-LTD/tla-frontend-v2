import React from 'react';
import SettingsTabs from './_components/SettingTab';

const SettingsLayout = ({ children }) => {
  return (
    <div className="">
      <SettingsTabs />
      {children}
    </div>
  );
};

export default SettingsLayout;
