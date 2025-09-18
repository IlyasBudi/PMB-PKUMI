/* Module Styles */
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "@/styles/theme.css"
import "../styles/globals.css"

/* React/Nextjs/Modules */
import { cookies } from "next/headers"
import { verify } from "@/lib/jwt"

/* Utils */
import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { getTokenData } from "@/lib/nextServers"

/* Components */
import AppWrapper from "./AppWrapper"
import WhatsappFloatButton from "@/components/WhatsappFloatButton"

export default async function RootLayout({ children }) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get(process.env.NEXT_PUBLIC_APP_TOKEN_NAME)?.value || null
  let userData = getTokenData()
  if (!userData && accessToken) {
    userData = await verify(accessToken)
  }

  return (
    <html lang="en">
      <body className={`${fontSans.className} ${fontSans.variable}`}>
        <WhatsappFloatButton />
        <AppWrapper
          valueProvider={{
            accessToken,
            userData,
          }}
        >
          {children}
        </AppWrapper>
      </body>
    </html>
  )
}

export const metadata = {
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  keywords: ["PMB", "PKU-MI", "PKU"],
  authors: [{ name: "Cravty Creative" }],
  colorScheme: "light",
  creator: "Cravty Creative",
  publisher: "Cravty Creative",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
}
