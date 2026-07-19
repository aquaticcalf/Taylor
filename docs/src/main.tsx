import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import "./index.css"
import "./App.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
