/* React/Nextjs/Modules */
import Image from "next/image"
import Link from "next/link"

/* Utils */
import { CLIENT_URL_WHATSAPP } from "@/lib/constants"

export default function WhatsappFloatButton() {
  return (
    <div className="fixed bottom-20 right-10 z-20 hidden h-16 w-16 sm:block">
      <Link href={CLIENT_URL_WHATSAPP} className="relative block h-full w-full" target="_blank">
        <Image src="/images/whatsapp-icon.png" alt="logo whatsapp" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="absolute drop-shadow-lg" />
      </Link>
    </div>
  )
}
