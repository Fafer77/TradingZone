import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Ten div jest kontenerem na całą treść strony obok sidebara */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </div>
    </SidebarProvider>
  )
}