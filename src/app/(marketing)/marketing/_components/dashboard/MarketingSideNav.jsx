'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SidebarTop from '@/app/lawyer/dashboard/_component/common/SidebarTop';
import { MarketingSidebarItems } from './MarketingSidebarItems';


export default function MarketingSideNav({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});
  const sidebarRef = useRef(null);

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth < 1280;

      if (!isMobile) return; // ✅ ignore on desktop

      const clickedInsideSidebar = sidebarRef.current?.contains(event.target);
      const clickedToggle = event.target.closest('[data-sidebar-toggle]');

      if (!clickedInsideSidebar && !clickedToggle) {
        setIsCollapsed(false); // ✅ hide sidebar
      }
    };

    if (isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed, setIsCollapsed]);

  const handleItemClick = () => {
    if (window.innerWidth <= 1280) {
      setIsCollapsed(false);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`h-[calc(100vh-64px)] w-[250px] lg:w-[300px] bg-white border-r shadow z-[99]
        fixed top-16 left-0 transform transition-transform duration-300 ease-in-out pb-8 ${
          isCollapsed ? 'translate-x-0' : '-translate-x-full'
        } xl:static xl:translate-x-0 xl:transform-none xl:z-auto`}
    >
      <div className="p-3 lg:p-4">
        <SidebarTop />
      </div>

      <nav className="p-3 lg:pt-2 lg:pb-3 lg:px-4 space-y-1 h-[calc(100%-170px)] overflow-y-auto">
        <h3 className="text-black leading-none font-semibold text-[20px] border-b border-[#f2f2f2] pb-2 mb-3">
          Admin Menu
        </h3>
        {MarketingSidebarItems?.navMain?.map((item) => {
          const hasSubItems =
            Array.isArray(item.items) && item.items.length > 0;
          const isParentActive =
            pathname.startsWith(item.url || '') ||
            (hasSubItems &&
              item.items.some((sub) => pathname.startsWith(sub.url || '')));

          if (hasSubItems) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition ${
                    isParentActive
                      ? 'bg-[linear-gradient(121deg,_rgb(27,171,169),_#ffffff)] font-medium text-white'
                      : ''
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronRight
                    className={`transition-transform duration-200 w-4 h-4 ${
                      openMenus[item.title] ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openMenus[item.title] && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.items.map((subItem) => {
                      const isActive = pathname === subItem.url;
                      return (
                        <Link
                          key={subItem.title}
                          href={subItem.url}
                          onClick={handleItemClick}
                          className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition ${
                            isActive
                              ? 'bg-[linear-gradient(121deg,_rgb(27,171,169),_#ffffff)] text-white font-medium'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          <span>{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.url}
              onClick={handleItemClick}
              className={`flex items-center gap-2 p-2 rounded transition font-medium ${
                pathname === item.url
                  ? 'bg-[linear-gradient(121deg,_rgb(27,171,169),_#ffffff)] text-white font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
