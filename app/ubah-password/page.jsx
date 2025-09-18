/* Utils */
import { siteConfig } from "@/config/site"
import FormUbahPassword from "./FormUbahPassword"

/* Components */

export default function UbahPassword() {
  return (
    <>
      <h1 className="text-xl font-medium text-gray-800">Ubah Password</h1>
      <h2 className="text-sm text-gray-600">ubah password akun anda</h2>
      <FormUbahPassword />
    </>
  )
}

export const metadata = {
  title: "Ubah Password",
  description: siteConfig.description,
}
