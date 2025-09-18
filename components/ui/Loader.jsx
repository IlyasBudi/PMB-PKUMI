/* React/Nextjs/Modules */
import Image from "next/image"

export const PageLoader = ({ visible }) => {
  return (
    <div className={`${visible ? "grid" : "hidden"} fixed inset-0 z-[9999] h-screen w-screen place-items-center bg-white/10 backdrop-blur-sm`}>
      <div className="flex flex-col gap-y-4">
        <div className="relative h-20 w-36">
          <Image src="/images/logo_pku-mi.png" alt="logo pku-mi" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="absolute animate-pulse" />
        </div>
        <div className="text-center text-sm font-medium text-green-primary">
          <i className="pi pi-spin pi-spinner" />
        </div>
      </div>
    </div>
  )
}
