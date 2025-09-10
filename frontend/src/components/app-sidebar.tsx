"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ScrollText, LayoutDashboard, BookMarked, CalendarCheck2, Calculator } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { NavMain, type NavItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const platformItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Playbook", url: "/playbook", icon: BookMarked },
  { title: "Daily Report Card", url: "/drc", icon: CalendarCheck2 },
  { title: "Risk Calculator", url: "/risk-calculator", icon: Calculator },
  { title: "Trade Samples", url: "/samples", icon: ScrollText},
]

const userData = {
  user: {
    name: "fafer77",
    email: "fafer77@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      {state === "expanded" ? (
        <SidebarHeader className="flex w-full flex-row justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            <ChevronLeft />
          </Button>
        </SidebarHeader>
      ) : (
        <SidebarHeader className="flex justify-center p-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            <ChevronRight />
          </Button>
        </SidebarHeader>
      )}

      <SidebarContent>
        <NavMain items={platformItems} title="Platform" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}