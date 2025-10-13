/* Utils */
import { siteConfig } from "@/config/site";
import { getTokenData } from "@/lib/nextServers";
import { getProfileData } from "@/services/user";
import { getListEducation } from "@/services/list";

/* Components */
import FormProfile from "./FormProfile";

export default async function Profile() {
  let userData = getTokenData();
  let lastUpdated = null;
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
  };

  // 🐞 DEBUG 1: Token Data
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 [DEBUG] Token Data:", userData);
  }

  // GET PROFILE DATA BY USERNAME TOKEN
  if (userData?.username) {
    await getProfileData(userData.username)
      .then((data) => {
        if (process.env.NODE_ENV === "development") {
          console.log("🟢 [DEBUG] Raw Profile Data:", data);
        }

        lastUpdated = data.last_updated;
        profileData = {
          ...profileData, // ⬅️ jaga default field tetap ada
          ...data,
          tanggal_lahir: data.tanggal_lahir
            ? new Date(data.tanggal_lahir)
            : null,
          username: userData.username, // ⬅️ tambahkan dari token
          email: userData.email, // ⬅️ tambahkan dari token
        };

        delete profileData.last_updated;

        if (process.env.NODE_ENV === "development") {
          console.log("🟢 [DEBUG] Final Profile Data:", profileData);
        }
      })
      .catch((err) => {
        console.error("🔴 [DEBUG] Gagal ambil data profile:", err);
      });
  } else {
    console.warn("⚠️ [DEBUG] userData.username tidak ditemukan di token!");
  }

  // GET LIST EDUCATION
  const educationList = await getListEducation()
    .then((list) => {
      if (process.env.NODE_ENV === "development") {
        console.log("🟢 [DEBUG] Education List:", list);
      }
      return list;
    })
    .catch((err) => {
      console.error("🔴 [DEBUG] Gagal ambil list education:", err);
      return [];
    });

  return (
    <>
      <h1 className="text-xl font-medium text-gray-800">Profile</h1>
      <h2 className="text-sm text-gray-600">data lengkap calon mahasiswa</h2>
      <FormProfile
        profile={profileData}
        updatedDate={lastUpdated}
        educationList={educationList}
      />
    </>
  );
}

export const metadata = {
  title: "Profile",
  description: siteConfig.description,
};
