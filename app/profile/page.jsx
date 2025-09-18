/* Utils */
import { siteConfig } from "@/config/site"
import { getTokenData } from "@/lib/nextServers"
import { getProfileData } from "@/services/user"
import { getListEducation } from "@/services/list"

/* Components */
import FormProfile from "./FormProfile"

export default async function Profile() {
  let userData = getTokenData()
  let lastUpdated = null
  let profileData = {
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    no_telp: "",
    no_telp_keluarga: "",
    pendidikan_akhir: null,
    jurusan_pendidikan_akhir: "",
    universitas_asal: "",
    nama_ayah: "",
    nama_ibu: "",
    pekerjaan_ayah: "",
    pekerjaan_ibu: "",
    alamat_orang_tua: "",
    username: "",
    email: "",
  }

  // GET PROFILE DATA BY USERNAME TOKEN
  if (userData?.username) {
    await getProfileData(userData.username)
      .then((data) => {
        lastUpdated = { ...data }.last_updated
        profileData = { ...data, tanggal_lahir: new Date(data.tanggal_lahir) }
        delete profileData.last_updated
      })
      .catch(() => {})
  }

  // GET LIST EDUCATION
  const educationList = await getListEducation().catch(() => [])
  return (
    <>
      <h1 className="text-xl font-medium text-gray-800">Profile</h1>
      <h2 className="text-sm text-gray-600">data lengkap calon mahasiswa</h2>
      <FormProfile profile={profileData} updatedDate={lastUpdated} educationList={educationList} />
    </>
  )
}

export const metadata = {
  title: "Profile",
  description: siteConfig.description,
}
