"use client"

import * as React from "react"
import {
  Settings2,
  CalendarCheck2,
  BookMarked,
  Calculator,
  LayoutDashboard,
  Home
} from "lucide-react"

import { NavMain, type NavItem} from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "fafer77",
    email: "fafer77@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

const platformItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Playbook", url: "/playbook", icon: BookMarked },
  { title: "Daily Report Card", url: "/drc", icon: CalendarCheck2 },
  { title: "Risk Calculator", url: "/risk-calculator", icon: Calculator },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={platformItems} title='platform'/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
