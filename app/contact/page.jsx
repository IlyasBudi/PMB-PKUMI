/* React/Nextjs/Modules */
import Image from "next/image"

/* Utils */
import { siteConfig } from "@/config/site"
import { CLIENT_URL_MAPS_LOCATION, ENUMERATION_PMB_CONTACT } from "@/lib/constants"
import { getContentPMB } from "@/services/webContent"

/* Components */
import Footer from "@/components/Footer"
import Container from "@/components/ui/Container"

export default async function Contact() {
  const icon = ["/images/maps.png", "/images/phone.png", "/images/email.png"]
  const listContent = await getContentPMB(ENUMERATION_PMB_CONTACT).catch(() => [])

  return (
    <>
      <Container className="min-h-[83vh] py-10">
        <iframe src={CLIENT_URL_MAPS_LOCATION} frameBorder="0" className="mb-20 h-[400px] w-full border-0" allowFullScreen="" id="maps-location"></iframe>
        <div className="grid grid-cols-3 gap-x-8 gap-y-14">
          {listContent.map(({ title, detail }, index) => (
            <div key={index} className="relative col-span-3 rounded-lg border p-8 shadow-lg shadow-gray-400/10 lg:col-span-1">
              <div className="absolute -top-10 right-1/2 flex h-16 w-16 translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-white">
                <div className="relative h-10 w-10">
                  <Image src={icon[index]} alt="logo maps" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
                </div>
              </div>
              <h2 className="mb-2 text-center text-2xl font-semibold text-green-primary">{title}</h2>
              <h3 className="text-center text-lg font-medium text-gray-900">{detail}</h3>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  )
}

export const metadata = {
  title: "Contact",
  description: siteConfig.description,
}
