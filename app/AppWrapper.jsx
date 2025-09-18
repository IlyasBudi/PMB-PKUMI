"use client"
/* React/Nextjs/Modules */
import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AppContext, UserContext } from "@/context"

/* Utils */
import { CLIENT_ROUTES_WITHOUT_TOKEN, ROUTES_WITHOUT_NAVIGATOR } from "@/lib/constants"

/* Components */
import { Navbar, NavbarResponsive } from "@/components/Navigator"
import { Toast } from "primereact/toast"
import { cn } from "@/lib/utils"
import { PageLoader } from "@/components/ui/Loader"

export default function AppWrapper({ children, valueProvider }) {
  const toast = useRef(null)
  const pathname = usePathname()
  const [pageLoader, setPageLoader] = useState(false)

  const handleToast = (severity, summary, detail, life) => {
    const severityColorMap = {
      success: {
        border: "border-l-green-400",
        shadow: "shadow-green-400/10",
      },
      info: {
        border: "border-l-sky-500",
        shadow: "shadow-sky-500/10",
      },
      warn: {
        border: "border-l-orange-400",
        shadow: "shadow-orange-400/10",
      },
      error: {
        border: "border-l-red-400",
        shadow: "shadow-red-400/10",
      },
    }

    toast.current.show({
      life,
      sticky: true,
      className: "border-none",
      content: (
        <div className={cn(`flex min-h-[4rem] items-center rounded-lg border bg-white p-1.5 pl-4 shadow-lg`, severityColorMap[severity]?.shadow)}>
          <div className={cn("flex min-h-[3rem] grow flex-col gap-[0.15rem] border-l-4 pl-3", severityColorMap[severity]?.border)}>
            <h3 className="font-medium">{summary}</h3>
            <p className="text-xs">{detail}</p>
          </div>
        </div>
      ),
    })

    setTimeout(() => {
      toast.current.clear()
    }, life || 3000)
  }

  return (
    <AppContext.Provider value={{ handleToast, setPageLoader }}>
      <UserContext.Provider value={{ ...valueProvider }}>
        {ROUTES_WITHOUT_NAVIGATOR.includes(pathname) ? (
          children
        ) : (
          <>
            <Navbar />
            <NavbarResponsive />
            {CLIENT_ROUTES_WITHOUT_TOKEN.includes(pathname) ? (
              <main className="pt-20">{children}</main>
            ) : (
              <main className="min-h-screen min-w-full bg-gray-50/50 pb-20 pt-24 md:pt-36">
                <div className="mx-auto h-full w-[95vw]">{children}</div>
              </main>
            )}
          </>
        )}
      </UserContext.Provider>
      <Toast ref={toast} />
      <PageLoader visible={pageLoader} />
    </AppContext.Provider>
  )
}
