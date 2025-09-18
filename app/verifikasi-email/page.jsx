/* React/Nextjs/Modules */
import Image from "next/image"

/* Utils */
import { siteConfig } from "@/config/site"
import FormVerifikasiEmail from "./FormVerifikasiEmail"

/* Components */

export default function Login() {
  return (
    <>
      <div
        className="absolute left-[calc(50%-11rem)] -z-10 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FDE3A1] to-[#1ABC9C] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
      <div className="grid min-h-screen backdrop-blur-2xl">
        <div className="my-10 flex flex-col items-center gap-7">
          <h1 className="text-xl font-semibold text-gray-900">
            Verifikasi Pendaftaran Akun <span className="font-bold">PMB</span>
          </h1>
          <div className="flex w-[90vw] flex-col gap-4 rounded-lg border border-[#9ce8d8] bg-white p-6 shadow-xl shadow-[#1ABC9C]/10 md:w-[34rem] md:p-8">
            <FormVerifikasiEmail />
          </div>
          <Image src="/images/logo_pku-mi.png" alt="logo pku-mi" width="120" height="60" />
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Verifikasi Email",
  description: siteConfig.description,
}
