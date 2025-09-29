"use client"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardContent } from "./DashboardContent"
import { getLatestNotification } from "@/services/notification"

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [latestNotification, setLatestNotification] = useState(null)

  useEffect(() => {
    const token = Cookies.get("auth_token")
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null

    setUserData(user)

    if (user?.username) {
      getLatestNotification(user.username)
        .then(setLatestNotification)
        .catch(() => null)
    }
  }, [router])

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
      <DashboardContent latestNotification={latestNotification} userData={userData} />
    </div>
  )
}
