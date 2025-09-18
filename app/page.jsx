/* React/Nextjs/Modules */
import Image from "next/image"
import Link from "next/link"

/* Utils */
import { siteConfig } from "@/config/site"
import { getContentPMB } from "@/services/webContent"
import { ENUMERATION_PMB_BERANDA } from "@/lib/constants"

/* Components */
import Footer from "@/components/Footer"
import Container from "@/components/ui/Container"

export default async function Homepage() {
  const listContent = await getContentPMB(ENUMERATION_PMB_BERANDA).catch(() => [])
  return (
    <div className="relative min-h-screen bg-white">
      <HomeBackground />
      <div className="absolute inset-x-0 top-0">
        <Container className="grid min-h-[80vh] grid-cols-12 gap-x-4" aria-label="Hero">
          <div className="col-span-12 flex h-fit flex-col justify-center gap-4 lg:col-span-7 lg:h-full" aria-label="Hero_Text">
            <h1 className="text-center text-4xl font-bold text-gray-900 sm:text-6xl lg:text-start">Penerimaan Mahasiswa Baru PKU Masjid Istiqlal</h1>
            <p className="text-center text-lg leading-8 text-gray-600 lg:text-start">Selamat Datang Di Website Resmi Portal Penerimaan Mahasiswa Baru Pendidikan Kader Ulama Masjid Istiqlal</p>
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="relative flex w-full flex-col rounded-full bg-white px-3 py-1 text-center text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 sm:w-fit sm:flex-row">
                Persyaratan Mahasiswa Baru
                <Link href="#content" className="ml-1 font-semibold text-green-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Baca Selengkapnya <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative order-first col-span-12 h-[20rem] w-full lg:order-last lg:col-span-5 lg:h-full" aria-label="Hero_Image">
            <Image src="/images/bg-homepage.png" alt="background-homepage" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
          </div>
        </Container>
        <Container className="flex items-center justify-center">
          <div className="h-12 w-fit rounded-xl border border-gray-400 bg-white px-[0.6rem] py-3 shadow-lg shadow-gray-800/20">
            <div className="animation-scroll-down h-1.5 w-1.5 rounded-full bg-gray-800"></div>
          </div>
        </Container>
        <Container className="flex flex-col gap-y-4 pb-20 pt-28" id="content">
          {listContent.map((item, index) => (
            <CardContent key={index} title={item.title} detail={item.detail} />
          ))}
        </Container>
        <Footer />
      </div>
    </div>
  )
}

const HomeBackground = () => {
  return (
    <div className="transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
      <div
        className="left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FDE3A1] to-[#1ABC9C] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  )
}

const CardContent = ({ title = "", detail = "" }) => {
  const createMarkup = (html) => ({ __html: html })
  return (
    <div className="group rounded-xl border-2 border-gray-100 bg-white p-6 hover:border-[#1ABC9C] hover:shadow-xl hover:shadow-[#1ABC9C]/10">
      <h2 className="flex items-center gap-x-2 text-lg font-semibold text-gray-800">
        <span className="text-2xl font-extrabold text-gray-400 group-hover:text-gray-900">#</span>
        {title}
      </h2>
      <div dangerouslySetInnerHTML={createMarkup(detail)} className="text-gray-500 group-hover:text-gray-900" />
    </div>
  )
}

export const metadata = {
  title: `Beranda - ${siteConfig.name}`,
  description: siteConfig.description,
}
