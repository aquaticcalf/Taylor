import { Routes, Route } from "react-router-dom"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/AppSidebar"
import { Home } from "@/pages/Home"
import { GettingStarted } from "@/pages/GettingStarted"
import { ApiOverview } from "@/pages/ApiOverview"
import { ApiModulePage } from "@/pages/ApiModulePage"

export default function App() {
  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm font-medium">Taylor Docs</span>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/api" element={<ApiOverview />} />
            <Route path="/api/:moduleName" element={<ApiModulePage />} />
          </Routes>
        </main>
      </SidebarInset>
    </div>
  )
}
