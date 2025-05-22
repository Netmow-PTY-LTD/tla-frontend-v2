'use client';
import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import { BuyerSidebarItems } from '@/app/client/_components/BuyerSidebarItems';
import { AdminSidebarItems } from '@/app/admin/_components/AdminSidebarItems';
import { selectCurrentUser } from '@/store/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';

export function SideNav() {
  const currentUser = useSelector(selectCurrentUser);
  const pathname = usePathname();

  const sidebarItems =
    currentUser?.role === 'admin' ? AdminSidebarItems : BuyerSidebarItems;

  return (
    <SidebarGroup className="nav-group">
      {currentUser?.role === 'user' && (
        <SidebarGroupLabel className="text-lg mb-2 text-black font-semibold">
          Client Main Menu
        </SidebarGroupLabel>
      )}

      <SidebarMenu>
        {sidebarItems?.navMain?.map((item) => {
          const isParentActive = item.items?.some(
            (sub) => pathname === sub.url
          );

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          className={
                            isSubActive ? 'bg-[#f3f3f3] font-medium' : ''
                          }
                        >
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className="flex gap-2 w-full"
                            >
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuSubItem
              key={item.title}
              className={
                pathname === item.url ? 'bg-[#f3f3f3] font-medium' : ''
              }
            >
              <SidebarMenuSubButton asChild>
                <Link href={item.url} className="flex gap-2 w-full">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
