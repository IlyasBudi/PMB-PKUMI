/* React/Next/Modules */
import Link from "next/link"

/* Utils */
import { siteConfig } from "@/config/site"
import { CLIENT_URL_WHATSAPP } from "@/lib/constants"

/* Components */

export default function UbahPassword() {
  return (
    <>
      <h1 className="text-xl font-medium text-gray-800">Bantuan</h1>
      <div>Untuk Informasi Bantuan, Anda dapat menghubungi Kami di :</div>
      <div>
        Nomor Telp./WA :{" "}
        <Link href={CLIENT_URL_WHATSAPP} target="_blank" className="text-blue-500 underline">
          +62 821-1378-5144
        </Link>
      </div>
      <div>Email : pmb@istiqlal.or.id</div>
    </>
  )
}

export const metadata = {
  title: "Ubah Password",
  description: siteConfig.description,
}
