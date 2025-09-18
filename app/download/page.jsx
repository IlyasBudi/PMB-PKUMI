/* Utils */
import { siteConfig } from "@/config/site"

/* Components */
import Footer from "@/components/Footer"
import Container from "@/components/ui/Container"
import { TableData } from "./TableData"

export default function Download() {
  return (
    <>
      <Container className="min-h-[83vh] py-10">
        <TableData />
      </Container>
      <Footer />
    </>
  )
}

export const metadata = {
  title: "Download",
  description: siteConfig.description,
}
