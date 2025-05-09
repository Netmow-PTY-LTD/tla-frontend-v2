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
import { BuyerSidebarItems } from '@/app/buyer/_components/BuyerSidebarItems';

export function SideNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {BuyerSidebarItems?.navMain?.map((item) =>
          item?.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
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
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <div className="flex gap-2">
                            {subItem.icon && <subItem.icon />}
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuSubItem key={item.title}>
              <SidebarMenuSubButton asChild>
                <div className="flex gap-2">
                  {item.icon && <item.icon />}
                  <Link href={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </div>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
