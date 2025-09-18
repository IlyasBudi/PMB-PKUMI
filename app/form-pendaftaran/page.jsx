/* Utils */
import { siteConfig } from "@/config/site"
import FormPendaftaran from "./FormPendaftaran"
import { getListProgramStudy } from "@/services/list"
import { getPendaftaranData, getStatusPendaftaran } from "@/services/user"
import { getTokenData } from "@/lib/nextServers"

export default async function Pendaftaran() {
  let userData = getTokenData()
  const pendaftaranData = await getPendaftaranData(userData.username).catch(() => ({
    jurusan: null,
    no_ijazah: "",
    no_ktp: "",
    nama_file_pas_foto: "",
    file_pas_foto: null,
    nama_file_ijazah: "",
    file_ijazah: null,
    nama_file_ktp: "",
    file_ktp: null,
    nama_file_cv: "",
    file_cv: null,
    nama_file_transkrip_nilai: "",
    file_transkrip_nilai: null,
    nama_file_sertifikat_bahasa: "",
    file_sertifikat_bahasa: null,
    nama_file_loa: "",
    file_loa: null,
    nama_file_surat_rekomendasi: "",
    file_surat_rekomendasi: null,
    nama_file_surat_usulan: "",
    file_surat_usulan: null,
    proposal_doktoral: "",
    last_updated: new Date(),
  }))
  const listProgramStudy = await getListProgramStudy().catch(() => [])
  const statusPendaftaran = await getStatusPendaftaran(userData.username)
    .then((data) => data.status)
    .catch(() => "ERROR")

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-800">Form Pendaftaran</h1>
      <h2 className="text-sm text-gray-600">formulir pendaftaran anda</h2>
      <FormPendaftaran jurusanList={listProgramStudy} status={statusPendaftaran} data={pendaftaranData} />
    </div>
  )
}

export const metadata = {
  title: "Pendaftaran",
  description: siteConfig.description,
}
