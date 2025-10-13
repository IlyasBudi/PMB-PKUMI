// "use server";
// import {
//   ENUMERATION_SERVICE_PENGAJUAN_PENDAFTARAN,
//   ENUMERATION_SERVICE_UPDATE_FORM_PENDAFTARAN,
//   WS_LOG_STATUS_DONE,
//   WS_LOG_STATUS_FAILED,
// } from "@/lib/constants";
// import { createWsLog, updateWsLog } from "@/lib/wsLog";
// import { pengajuanPendaftaran, updatePendaftaranData } from "@/services/user";

// export const actionUpdatePendaftaran = async (value, username) => {
//   let wsLog = null
//   try {
//     let reqWsLog = { ...value }
//     if (reqWsLog.file_ijazah) {
//       delete reqWsLog.file_ijazah
//     }
//     if (reqWsLog.file_ktp) {
//       delete reqWsLog.file_ktp
//     }
//     if (reqWsLog.file_cv) {
//       delete reqWsLog.file_cv
//     }
//     if (reqWsLog.file_pas_foto) {
//       delete reqWsLog.file_pas_foto
//     }
//     if (reqWsLog.file_transkrip_nilai) {
//       delete reqWsLog.file_transkrip_nilai
//     }
//     if (reqWsLog.file_sertifikat_bahasa) {
//       delete reqWsLog.file_sertifikat_bahasa
//     }
//     if (reqWsLog.file_loa) {
//       delete reqWsLog.file_loa
//     }
//     if (reqWsLog.file_surat_rekomendasi) {
//       delete reqWsLog.file_surat_rekomendasi
//     }
//     if (reqWsLog.file_surat_usulan) {
//       delete reqWsLog.file_surat_usulan
//     }
//     if (reqWsLog.proposal_doktoral) {
//       delete reqWsLog.proposal_doktoral
//     }
//     wsLog = await createWsLog(ENUMERATION_SERVICE_UPDATE_FORM_PENDAFTARAN, reqWsLog)
//     const response = await updatePendaftaranData(value, username)
//     await updateWsLog(wsLog, WS_LOG_STATUS_DONE, response)
//     return [response]
//   } catch (error) {
//     console.log(error)
//     if (wsLog) {
//       await updateWsLog(wsLog, !error.name ? WS_LOG_STATUS_DONE : WS_LOG_STATUS_FAILED, error)
//     }
//     throw [error, true]
//   }
// }

export const actionUpdatePendaftaran = async (value, username) => {
  try {
    const formData = new FormData();

    // tambahkan semua field teks
    Object.entries(value).forEach(([key, val]) => {
      if (!key.startsWith("file_")) formData.append(key, val || "");
    });

    // tambahkan semua file
    Object.entries(value).forEach(([key, val]) => {
      if (key.startsWith("file_") && val instanceof File) {
        formData.append(key, val);
      }
    });

    formData.append("username", username);

    const response = await fetch(`/api/user/form-pendaftaran`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return [data, false];
  } catch (error) {
    console.error("Error Update Form:", error);
    return [error, true];
  }
};

// export const actionPengajuanPendaftaran = async (username) => {
//   let wsLog = null;
//   try {
//     wsLog = await createWsLog(
//       ENUMERATION_SERVICE_PENGAJUAN_PENDAFTARAN,
//       username
//     );
//     const response = await pengajuanPendaftaran(username);
//     await updateWsLog(wsLog, WS_LOG_STATUS_DONE, response);
//     return [response];
//   } catch (error) {
//     console.log(error);
//     if (wsLog) {
//       await updateWsLog(
//         wsLog,
//         !error.name ? WS_LOG_STATUS_DONE : WS_LOG_STATUS_FAILED,
//         error
//       );
//     }
//     return [error, true];
//   }
// };

export const actionPengajuanPendaftaran = async (username) => {
  try {
    const response = await fetch(`api/user/pengajuan-pendaftaran`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return [data, false];
  } catch (error) {
    console.error("Error Ajukan Pendaftaran:", error);
    const message = error?.message || "Gagal mengajukan pendaftaran";
    // handleToast("warn", "Gagal", message, 3000);
    return [error, true];
  }
};
