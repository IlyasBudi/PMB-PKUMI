/* Utils */
import { siteConfig } from "@/config/site"
import { ENUMERATION_PMB_FAQ } from "@/lib/constants"
import { getContentPMB } from "@/services/webContent"

/* Components */
import Footer from "@/components/Footer"
import Container from "@/components/ui/Container"
import AccordionData from "./AccordionData"

export default async function Faq() {
  const listContent = await getContentPMB(ENUMERATION_PMB_FAQ).catch(() => [])

  return (
    <>
      <Container className="min-h-[83vh] py-10">
        <AccordionData data={listContent} />
      </Container>
      <Footer />
    </>
  )
}

export const metadata = {
  title: "FAQ",
  description: siteConfig.description,
}
