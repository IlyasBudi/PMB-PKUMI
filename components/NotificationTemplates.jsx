import { cn } from "@/lib/utils"
import { actionUpdateStatusNotif } from "@/services/notification"
import { useRouter } from "next/navigation"

export function NotificationTemplates({ href, title, detail, isRead = false, id }) {
  const router = useRouter()

  const handleOnClick = () => {
    if (!isRead) {
      actionUpdateStatusNotif({ notification_id: id, status: true })
        .then(([res, isError]) => {
          if (isError) throw res
          return
        })
        .catch((error) => console.error(error))
    }
    if (href) {
      return router.push(href)
    }
    return
  }

  return (
    <button onClick={handleOnClick} className="mb-1 w-full border-y p-2 text-xs">
      {title && (
        <div className="mb-1 flex items-start justify-between rounded-sm">
          <h3 className="font-semibold">{title}</h3>
          {!isRead && <i className="right-[0.6rem] top-2 h-3 w-3 animate-pulse rounded-full border border-white bg-red-500" />}
        </div>
      )}
      <p className={cn(detail === "tidak ada notifikasi" ? "text-center" : "text-left")}>{detail || ""}</p>
    </button>
  )
}
