// contexts/SidebarToggleContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

const SidebarToggleContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {},
});

export const useSidebarToggle = () => useContext(SidebarToggleContext);

export const SidebarToggleProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  console.log('isCollapsed', isCollapsed);

  return (
    <SidebarToggleContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarToggleContext.Provider>
  );
};
