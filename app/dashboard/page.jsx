/* Utils */
import { siteConfig } from "@/config/site"
import { DashboardContent } from "./DashboardContent"
import { getTokenData } from "@/lib/nextServers"
import { getLatestNotification } from "@/services/notification"

export default async function Dashboard() {
  let userData = getTokenData()
  const latestNotification = await getLatestNotification(userData.username).catch(() => null)
  return (
    <div>
      <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
      <DashboardContent latestNotification={latestNotification} />
    </div>
  )
}

export const metadata = {
  title: "Dashboard",
  description: siteConfig.description,
}
