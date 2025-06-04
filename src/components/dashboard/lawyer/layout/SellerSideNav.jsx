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
import { SellerSidebarItems } from './SellerSidebarItems';
import { usePathname } from 'next/navigation';

export function LawyerSideNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup className="nav-group">
        <SidebarGroupLabel className="text-lg mb-2 text-black">
          Lawyer Menu
        </SidebarGroupLabel>
        <SidebarMenu>
          {SellerSidebarItems?.navMain?.map((item) => {
            const isParentActive =
              pathname.startsWith(item.url || '') ||
              (item.items?.length &&
                item.items.some((sub) => pathname.startsWith(sub.url || '')));

            return item.items ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem
                  className={isParentActive ? 'bg-[#f3f3f3]' : ''}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={
                              isActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : ''
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
                className={pathname === item.url ? 'bg-[#f3f3f3]' : ''}
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
    </>
  );
}
