'use client';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

const DropdownMenu = ({ menuItems, defaultSelected }) => {
  const [selected, setSelected] = useState(
    defaultSelected || menuItems[0]?.label
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{selected}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="p-2 bg-white shadow-md rounded-md">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setSelected(item.label)}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DropdownMenu;
