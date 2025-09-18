/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Document, Image, Page, Text, View } from "@react-pdf/renderer"
import { forwardRef } from "react"

export const IDCardTemplate = forwardRef(({ nama = "", nim = "", photo = "", visible = false, id }, ref) => {
  return (
    <div
      ref={ref}
      id={id}
      className={`fixed -left-[30rem] top-0 z-[9999] flex h-[538px] w-[361px] flex-col items-center bg-white bg-[url(/images/ID-CARD-Front.png)] pt-[8.4rem] ${visible ? "" : "hidden"}`}
    >
      <div className="h-[13rem] w-[13rem] overflow-hidden rounded-full border-[7px] border-white bg-gray-200">{photo && <img src={photo} alt="photo-id-card" className="object-center" />}</div>
      <div className="mt-5 flex w-full flex-col pl-9 text-white">
        <div className="flex gap-x-2">
          <span className="w-14">Nama</span>
          <span className="font-light">: {nama}</span>
        </div>
        <div className="flex gap-x-2">
          <span className="w-14">NIM</span>
          <span className="font-light">: {nim}</span>
        </div>
      </div>
    </div>
  )
})

export const IDCard = ({ cardFrontImage = "/images/ID-CARD-Front.png", cardBackImage = "/images/ID-CARD-Back.png", photo = "/images/logo_pku-mi.png", nama = "", nim = "" }) => {
  return (
    <Document>
      <Page size="A4" style={{ display: "flex", flexDirection: "column" }}>
        <View style={{ flexGrow: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image style={{ width: "361px", height: "538px" }} src={cardFrontImage} />
          <View
            style={{
              position: "absolute",
              top: "33.5%",
              left: "32%",
              overflow: "hidden",
              borderRadius: "50%",
              width: "215px",
              height: "215px",
              border: "10px solid white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image src={photo} style={{ width: "100%" }} />
          </View>
          <View style={{ position: "absolute", top: "62%", left: "24%" }}>
            <View style={{ display: "flex", flexDirection: "row", marginBottom: "6px" }}>
              <Text style={{ minWidth: "100px", color: "white" }}>Nama</Text>
              <Text style={{ color: "white" }}>: {nama}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "100px", color: "white" }}>NIM</Text>
              <Text style={{ color: "white" }}>: {nim}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexGrow: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image style={{ width: "361px", height: "538px" }} src={cardBackImage} />
        </View>
      </Page>
    </Document>
  )
}

IDCardTemplate.displayName = "IDCardTemplate"
