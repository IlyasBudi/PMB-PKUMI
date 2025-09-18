/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer"
import * as constants from "@/lib/constants"
import { formatDate } from "@/lib/utils"

const styles = StyleSheet.create({
  page: {
    flexDirection: "col",
    backgroundColor: "#ffffff",
    fontSize: "12px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "30px 34px 0 40px",
    borderRight: "10px solid #203E1E",
  },
  headerLogo: {
    maxWidth: "280px",
    maxHeight: "70px",
  },
  headerText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingTop: "5px",
  },
  content: {
    flexGrow: 1,
    margin: "20px 70px",
  },
  footer: {
    borderRight: "10px solid #FF6A31",
    position: "relative",
    maxHeight: "40px",
  },
})

export const LOA = ({ dataLOA = {} }) => {
  const {
    nama_lengkap = "",
    email = "",
    tempat_lahir = "",
    tanggal_lahir = "",
    no_telp = "",
    program_studi = "",
    nomor_sk = "",
    nomor_ujian = "",
    tahun_ajaran = "",
    periode_semester = "",
    tanggal_mulai_akademik = new Date(),
    lokasi_terbit = "",
    tanggal_terbit = new Date(),
    nama_penandatangan = "",
    posisi_penandatangan = "",
    nidn_penandatangan = "",
    headerImage = "/images/logo-pascasarjana.png",
    footerImage = "/images/footer-LOA.png",
    stempelImage = "/images/stempel.png",
  } = dataLOA

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.headerLogo} src={headerImage} />
          <View style={styles.headerText}>
            <Text>{constants.PKUMI_ADDRESS_STREET_NAME}</Text>
            <Text>
              {constants.PKUMI_ADDRESS_WARD}, {constants.PKUMI_ADDRESS_SUBDISTRICT},
            </Text>
            <Text>
              {constants.PKUMI_ADDRESS_CITY} {constants.PKUMI_ADDRESS_POSTAL_CODE}
            </Text>
            <Text style={{ textDecoration: "underline" }}>{constants.PKUMI_PASCASARJANA_URL}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={{ textDecoration: "underline", textAlign: "center", fontFamily: "Helvetica-Bold" }}>SURAT KETERANGAN</Text>
          <Text style={{ textAlign: "center", fontFamily: "Helvetica-Bold" }}>Nomor: {nomor_sk}</Text>
          <Text style={{ marginTop: "12px" }}>Direktur Pascasarjana Universitas PTIQ Jakarta, dengan ini menerangkan bahwa:</Text>
          <View style={{ paddingLeft: "50px", display: "flex", flexDirection: "column", marginTop: "12px" }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "150px" }}>Nama</Text>
              <Text>: {nama_lengkap}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "150px" }}>Tempat, Tanggal Lahir</Text>
              <Text>
                : {tempat_lahir}, {tanggal_lahir}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "150px" }}>Nomor Ujian</Text>
              <Text>: {nomor_ujian}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "150px" }}>Nomor Telepon</Text>
              <Text>: {no_telp}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "150px" }}>Email</Text>
              <Text>: {email}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ minWidth: "150px" }}>Jenjang Studi</Text>
              <Text>: {`${program_studi ? (program_studi.includes("S2") ? "Program Magister" : "Program Doktor") : ""} (${program_studi})`}</Text>
            </View>
          </View>
          <Text
            style={{ marginTop: "12px", textAlign: "justify" }}
          >{`yang bersangkutan adalah peserta ujian masuk Pendidikan Kader Ulama Masjid Istiqlal yang dinyatakan DITERIMA sebagai mahasiswa baru di Program Studi Ilmu Al-Qur'an dan Tafsir Konsentrasi Ilmu Tafsir, Pascasarjana Universitas PTIQ Jakarta Periode Semester ${periode_semester} TA. ${tahun_ajaran}/${
            parseInt(tahun_ajaran) + 1
          }. Kegiatan Akademik dimulai pada tanggal ${formatDate(new Date(tanggal_mulai_akademik))}.`}</Text>
          <Text
            style={{ marginTop: "12px", textAlign: "justify" }}
          >{`Saudara wajib melakukan registrasi sesuai pengumuman Rektor Nomor: ${constants.PKUMI_LOA_ANNOUNCEMENT_NUMBER} untuk memperoleh status sebagai mahasiswa.`}</Text>
          <Text style={{ marginTop: "12px", textAlign: "justify" }}>Demikian keterangan ini agar dipergunakan sebagaimana mestinya.</Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: "12px" }}>
            <View style={{ width: "200px", position: "relative" }}>
              <Image src={stempelImage} style={{ position: "absolute", width: "75px", height: "95px", marginTop: "34px", marginLeft: "-36px" }} />
              <Text style={{ textAlign: "center" }}>
                {lokasi_terbit}, {formatDate(new Date(tanggal_terbit))}
              </Text>
              <Text style={{ marginTop: "12px", textAlign: "center" }}>{posisi_penandatangan}</Text>
              <Text style={{ textAlign: "center" }}>Universitas PTIQ Jakarta</Text>
              <Text style={{ marginTop: "60px", textAlign: "center" }}>{nama_penandatangan}</Text>
              <Text style={{ textAlign: "center" }}>NIDN. {nidn_penandatangan}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Image src={footerImage} />
        </View>
      </Page>
    </Document>
  )
}
