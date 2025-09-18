"use client"
/* React/Nextjs/Modules */
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useRef, useContext } from "react"
import { AppContext, UserContext } from "@/context"

/* Utils */
import * as constants from "@/lib/constants"
import { cn } from "@/lib/utils"
import httpCall from "@/lib/axios"
import { webPrivateMenu, webPublicMenu } from "@/services/menu"
import { getNotification } from "@/services/notification"

/* Components */
import Container from "./ui/Container"
import { buttonStyles, buttonStylesSecondary } from "@/components/ui/Button"
import { Menu } from "primereact/menu"
import { NotificationTemplates } from "./NotificationTemplates"
import { ScrollPanel } from "primereact/scrollpanel"

const getAccountMenuList = (setPageLoader, router) => {
  return [
    {
      label: "Ubah Password",
      icon: "pi pi-user-edit",
      command: () => router.push(constants.CLIENT_PATH.UBAH_PASSWORD),
    },
    { separator: true },
    {
      label: "Logout",
      icon: "pi pi-fw pi-sign-out",
      command: () => {
        setPageLoader(true)
        httpCall("GET", constants.API_PATH.AUTH_LOGOUT)
          .then(() => {
            return location.reload()
          })
          .catch((error) => {
            console.error(error.message)
          })
          .finally(() => {
            setPageLoader(false)
          })
      },
    },
  ]
}

const getTemplateNotificationList = (notificationList) => {
  if (notificationList.length < 1) {
    return [{ template: <NotificationTemplates detail="tidak ada notifikasi" /> }]
  }
  return [
    {
      template: (
        <ScrollPanel className="max-h-screen lg:max-h-[50vh]">
          {notificationList.map((item, i) => (
            <NotificationTemplates key={i} href={item.url} isRead={item.is_read} title={item.title} detail={item.detail} id={item.id} />
          ))}
        </ScrollPanel>
      ),
    },
  ]
}

export const Navbar = () => {
  const pathname = usePathname()
  const isDashboard = !constants.CLIENT_ROUTES_WITHOUT_TOKEN.includes(pathname)
  const { userData } = useContext(UserContext)
  const { setPageLoader } = useContext(AppContext)
  const accountMenu = useRef(null)
  const notificationMenu = useRef(null)
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const [notificationList, setNotificationList] = useState([])

  useEffect(() => {
    if (userData?.username) {
      getNotification(userData.username).then((data) => {
        setNotificationList(data)
      })
      setInterval(async () => {
        await getNotification(userData.username).then((data) => {
          setNotificationList(data)
        })
      }, 60000);
    }

    const onScroll = () => setOffset(window.pageYOffset)
    window.removeEventListener("scroll", onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className={cn("fixed z-10 hidden w-full items-center bg-white md:flex", isDashboard ? "border-b" : offset >= 130 ? "border-b" : "", isDashboard ? "h-16" : "h-20")} aria-label="Navbar">
        <Container className={isDashboard ? "min-w-[95vw] max-w-[95vw] px-0 md:px-0" : ""}>
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4" aria-label="Logo">
              <Link href={constants.CLIENT_PATH.BASE} className={cn("relative", isDashboard ? "h-11 w-[5.5rem]" : "h-12 w-24")}>
                <Image src="/images/logo_pku-mi.png" alt="logo pku-mi" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="absolute" />
              </Link>
              {isDashboard ? (
                <>
                  <div className="h-12 border-l"></div>
                  <div className="flex h-16 items-center gap-x-5" aria-label="Navigation">
                    {webPublicMenu.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex h-full items-center border-b-2 text-sm font-medium leading-6 text-gray-400 hover:border-green-primary hover:text-green-primary",
                          pathname === item.href ? "border-gray-900" : "border-transparent"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {isDashboard ? (
              <></>
            ) : (
              <div className={cn("flex h-20 items-center", userData ? "gap-x-4 lg:gap-x-10" : "gap-x-6 lg:gap-x-12")} aria-label="Navigation">
                {(userData ? [...webPublicMenu, ...webPrivateMenu[userData?.user_type || "default"].filter((v) => v.href === constants.CLIENT_PATH.DASHBOARD)] : webPublicMenu || []).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex h-full items-center border-b-2 text-sm font-semibold leading-6 text-gray-900 hover:border-gray-900",
                      pathname === item.href ? "border-gray-900" : "border-transparent"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            {userData ? (
              <div className="flex items-center gap-x-5">
                <button
                  className={cn(
                    "relative h-10 w-10 rounded-full border border-transparent p-2 hover:border-gray-100 hover:shadow-lg hover:shadow-gray-700/10 focus:ring-2 focus:ring-green-secondary focus:ring-offset-2 focus-visible:outline-none"
                  )}
                  onClick={(e) => notificationMenu.current.toggle(e)}
                >
                  <i className="pi pi-bell font-medium text-gray-800" />
                  {(notificationList || []).some((v) => v.is_read === false) ? (
                    <i className="absolute right-[0.6rem] top-2 h-2 w-2 animate-pulse rounded-full border border-white bg-red-500" />
                  ) : (
                    <></>
                  )}
                  <Menu model={getTemplateNotificationList(notificationList)} popup ref={notificationMenu} id="popup_account_menu" popupAlignment="right" />
                </button>
                <button
                  className="group flex items-center gap-x-3 rounded-lg border border-transparent p-2 hover:border-gray-100 hover:shadow-lg hover:shadow-gray-700/10 focus:ring-2 focus:ring-green-secondary focus:ring-offset-2 focus-visible:outline-none"
                  onClick={(e) => accountMenu.current.toggle(e)}
                >
                  <div className="grid h-7 w-7 place-items-center rounded-full border border-gray-300 bg-gray-50 text-sm transition-all ease-in group-hover:border-green-primary group-hover:bg-green-primary group-hover:text-white group-focus:border-green-primary group-focus:bg-green-primary group-focus:text-white">
                    {userData?.username ? userData.username.charAt(0).toUpperCase() : "X"}
                  </div>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 group-focus:text-gray-900">{userData?.username || ""}</span>
                  <i className="pi pi-angle-down text-sm text-gray-600" />
                  <Menu model={getAccountMenuList(setPageLoader, router)} popup ref={accountMenu} id="popup_account_menu" popupAlignment="right" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-x-4" aria-label="CTA_Authentication">
                <Link href={constants.CLIENT_PATH.LOGIN} className={buttonStylesSecondary}>
                  Log in
                </Link>
                <Link href={constants.CLIENT_PATH.REGISTER} className={buttonStyles}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </Container>
      </div>
      {isDashboard ? (
        <div className={cn("fixed top-16 z-10 hidden h-16 w-full items-center border-b bg-white shadow-xl shadow-gray-500/5 md:flex")}>
          <div className="mx-auto flex w-[95vw] gap-x-6">
            {webPrivateMenu[userData?.user_type || "default"].map((item) => (
              <Link key={item.name} href={item.href} className={pathname === item.href ? buttonStyles : buttonStylesSecondary}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export const NavbarResponsive = () => {
  const pathname = usePathname()
  const { userData } = useContext(UserContext)
  const { setPageLoader } = useContext(AppContext)
  const accountMenu = useRef(null)
  const notificationMenu = useRef(null)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notificationList, setNotificationList] = useState([])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (userData?.username) {
      getNotification(userData.username).then((data) => {
        setNotificationList(data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="fixed z-20 flex w-full items-center justify-between border-b bg-white px-6 py-4 md:hidden" aria-label="Navbar_Responsive">
        <div className="flex" aria-label="Logo">
          <Link href={constants.CLIENT_PATH.BASE} className="relative h-12 w-24">
            <Image src="/images/logo_pku-mi.png" alt="logo pku-mi" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="absolute" />
          </Link>
        </div>
        <button className={buttonStylesSecondary} onClick={() => setOpen((prev) => !prev)}>
          <i className={cn("pi", open ? "pi-times" : "pi-bars")}></i>
        </button>
      </div>
      <div
        className={cn("fixed z-10 flex min-h-screen w-4/5 flex-col gap-y-4 border-r bg-white p-6 pb-16 pt-28 transition-[left] duration-200 ease-in-out md:hidden", open ? "left-0" : "left-[-80%]")}
        aria-label="sidebar"
      >
        <div className="flex flex-col gap-y-4">
          {(userData ? [...webPublicMenu, ...webPrivateMenu[userData?.user_type || "default"]] : webPublicMenu || []).map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "rounded-lg border-2 px-5 py-3 text-sm font-medium hover:border-green-primary hover:bg-green-primary hover:text-white",
                pathname === item.href ? "border-green-primary bg-green-primary text-white" : "border-gray-100 bg-white text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {userData ? (
          <div className="flex items-center justify-end gap-x-5">
            <button
              className={cn(
                "relative h-10 w-10 rounded-full border border-transparent p-2 hover:border-gray-100 hover:shadow-lg hover:shadow-gray-700/10 focus:ring-2 focus:ring-green-secondary focus:ring-offset-2 focus-visible:outline-none"
              )}
              onClick={(e) => notificationMenu.current.toggle(e)}
            >
              <i className="pi pi-bell font-medium text-gray-800" />
              {(notificationList || []).some((v) => v.is_read === false) ? <i className="absolute right-[0.6rem] top-2 h-2 w-2 animate-pulse rounded-full border border-white bg-red-500" /> : <></>}
              <Menu model={getTemplateNotificationList(notificationList)} popup ref={notificationMenu} id="popup_account_menu" />
            </button>
            <button
              className="flex items-center gap-x-3 rounded-lg border border-transparent p-2 hover:border-gray-100 hover:shadow-lg hover:shadow-gray-700/10 focus:ring-2 focus:ring-green-secondary focus:ring-offset-2 focus-visible:outline-none"
              onClick={(e) => accountMenu.current.toggle(e)}
            >
              <div className="grid h-7 w-7 place-items-center rounded-full border border-gray-300 bg-gray-50">{userData?.username ? userData.username.charAt(0).toUpperCase() : "X"}</div>
              <span className="font-medium">{userData?.username || ""}</span>
              <i className="pi pi-angle-down text-sm text-gray-600" />
              <Menu model={getAccountMenuList(setPageLoader, router)} popup ref={accountMenu} id="popup_account_menu" popupAlignment="right" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4">
            <Link href={constants.CLIENT_PATH.LOGIN} className={buttonStylesSecondary}>
              Log in
            </Link>
            <Link href={constants.CLIENT_PATH.REGISTER} className={buttonStyles}>
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
