"use client"
/* React/Nextjs/Modules */
import { useContext } from "react"
import { UserContext } from "@/context"

/* Utils */
import { cn, waktuHariIni } from "@/lib/utils"
import { Button, buttonStyles } from "@/components/ui/Button"
import Link from "next/link"
import { CLIENT_PATH } from "@/lib/constants"

export function DashboardContent({ latestNotification, userData }) {
  return (
    <>
      <section>
        <div className="mt-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 shadow-xl shadow-green-primary/5">
          <p className="font-medium text-gray-900">
            Selamat {waktuHariIni()}, {userData?.username || "Anonymous"}
          </p>
          <small>
            cek notifikasi pada tombol lonceng <i className="pi pi-bell h-5 w-5 rounded-full border bg-white text-center align-middle text-xs font-medium text-gray-800" /> untuk mengetahui
            perkembangan pendaftaran anda
          </small>
        </div>
      </section>
      <section className="mt-6">
        <h3>Pemberitahuan Terkini</h3>
        {latestNotification && (
          <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50 px-4 py-2 shadow-xl shadow-orange-500/10">
            <div className="flex items-center gap-2">
              {!latestNotification.is_read && <span className="rounded border border-red-300 bg-red-100 px-2 py-0.5 font-medium text-red-400">New</span>}
              <h4 className="font-medium">{latestNotification.title}</h4>
            </div>
            <small>{latestNotification.detail}</small>
          </div>
        )}
      </section>
    </>
  )
}
