"use server"
import { Certificate, Enumeration, Student, UserFiles, UserPhoto, Users, sequelize } from "@/database/models"
import {
  ENUMERATION_REGISTRATION_STATUS_DIAJUKAN_KEMBALI_BERKAS,
  ENUMERATION_REGISTRATION_STATUS_MENGAJUKAN_BERKAS,
  RESPONSE_CODE_BAD_REQUEST,
  RESPONSE_CODE_NOT_FOUND,
  RESPONSE_CODE_SUCCESS,
  RESPONSE_MESSAGE_SUCCESS,
  STATUS_PENDAFTARAN_BARU,
  STATUS_PENDAFTARAN_DIAJUKAN_KEMBALI_BERKAS,
  STATUS_PENDAFTARAN_DIJADWALKAN_WAWANCARA,
  STATUS_PENDAFTARAN_DISETUJUI_BERKAS,
  STATUS_PENDAFTARAN_HADIR_WAWANCARA,
  STATUS_PENDAFTARAN_MAHASISWA_AKTIF,
  STATUS_PENDAFTARAN_MENGAJUKAN_BERKAS,
  STATUS_PENDAFTARAN_TIDAK_HADIR_WAWANCARA,
  STATUS_PENDAFTARAN_TIDAK_LULUS_PENDAFTARAN,
} from "@/lib/constants"
import { decryptCrypto, encryptCrypto } from "@/lib/crypto"
import { hitungUmur, schemaValidation } from "@/lib/utils"
import { userProfileSchema } from "@/validation/user"
import { QueryTypes } from "sequelize"

export const getProfileData = async (username) => {
  try {
    if (!username) {
      throw {
        status: RESPONSE_CODE_NOT_FOUND,
        message: "User tidak ditemukan",
      }
    }

    return await Student.findOne({
      include: [
        {
          model: Users,
          where: { username, isActive: true, isDelete: false },
          attributes: ["username", "email"],
        },
      ],
      attributes: [
        "fullname",
        "birthPlace",
        "birthDate",
        "gender",
        "lastEducation",
        "lastEducationMajor",
        "phoneNumber",
        "familyPhoneNumber",
        "homeUniversity",
        "fatherName",
        "motherName",
        "fatherJob",
        "motherJob",
        "parentAddress",
        "createdDate",
        "updatedDate",
      ],
      where: { isDelete: false },
      raw: true,
      nest: true,
    }).then((data) => {
      if (!data) {
        throw {
          status: RESPONSE_CODE_NOT_FOUND,
          message: "User tidak ditemukan",
        }
      }

      return {
        nama_lengkap: data.fullname || "",
        tempat_lahir: data.birthPlace || "",
        tanggal_lahir: data.birthDate || "",
        jenis_kelamin: data.gender || "",
        no_telp: data.phoneNumber || "",
        no_telp_keluarga: data.familyPhoneNumber || "",
        pendidikan_akhir: data.lastEducation,
        jurusan_pendidikan_akhir: data.lastEducationMajor || "",
        universitas_asal: data.homeUniversity || "",
        nama_ayah: data.fatherName || "",
        nama_ibu: data.motherName || "",
        pekerjaan_ayah: data.fatherJob || "",
        pekerjaan_ibu: data.motherJob || "",
        alamat_orang_tua: data.parentAddress || "",
        username: data.User.username || "",
        email: data.User.email || "",
        last_updated: data.updatedDate || data.createdDate || null,
      }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateProfileData = async (value, username) => {
  let transaction = null
  try {
    const user = await Users.findOne({ where: { username, isActive: true, isDelete: false }, attributes: ["id", "email"], raw: true })
    if (!user?.id) {
      throw {
        status: RESPONSE_CODE_NOT_FOUND,
        message: "User tidak ditemukan",
      }
    }

    let isUpdateEmail = false
    if (value.email !== user.email) {
      const findExistEmail = await Users.findOne({ where: { email: value.email, isDelete: false }, attributes: ["id"], raw: true })
      if (findExistEmail) {
        throw {
          status: RESPONSE_CODE_BAD_REQUEST,
          message: "Email sudah digunakan",
        }
      }
      isUpdateEmail = true
    }

    transaction = await sequelize.transaction()

    await Student.update(
      {
        fullname: value.nama_lengkap,
        birthPlace: value.tempat_lahir,
        birthDate: value.tanggal_lahir,
        gender: value.jenis_kelamin,
        phoneNumber: value.no_telp,
        familyPhoneNumber: value.no_telp_keluarga || null,
        lastEducation: value.pendidikan_akhir || null,
        lastEducationMajor: value.jurusan_pendidikan_akhir,
        homeUniversity: value.universitas_asal || null,
        fatherName: value.nama_ayah || null,
        motherName: value.nama_ibu || null,
        fatherJob: value.pekerjaan_ayah || null,
        motherJob: value.pekerjaan_ibu || null,
        parentAddress: value.alamat_orang_tua || null,
        updatedDate: new Date(),
        updatedBy: user.id,
      },
      { where: { userId: user.id }, transaction }
    )

    if (isUpdateEmail) {
      await Users.update(
        {
          email: value.email,
          updatedDate: new Date(),
          updatedBy: user.id,
        },
        { where: { id: user.id }, transaction }
      )
    }

    await transaction.commit()

    return {
      status: RESPONSE_CODE_SUCCESS,
      message: RESPONSE_MESSAGE_SUCCESS,
    }
  } catch (error) {
    console.error(error)
    if (transaction) {
      await transaction.rollback()
    }
    throw error
  }
}

export const getStatusPendaftaran = async (username) => {
  try {
    if (!username) {
      throw {
        status: RESPONSE_CODE_NOT_FOUND,
        message: "User tidak ditemukan",
      }
    }

    return await Student.findOne({
      include: [
        {
          model: Users,
          where: { username, isActive: true, isDelete: false },
          attributes: [],
        },
        {
          model: Enumeration,
          where: { isActive: true },
          as: "regStatus",
          attributes: ["name"],
        },
      ],
      attributes: ["registrationStatus"],
      where: { isDelete: false },
      raw: true,
      nest: true,
    }).then((data) => {
      if (!data?.regStatus?.name) {
        throw {
          status: RESPONSE_CODE_NOT_FOUND,
          message: "Status tidak ditemukan",
        }
      }

      return {
        status: data?.regStatus?.name,
      }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getPendaftaranData = async (username) => {
  try {
    if (!username) {
      throw {
        status: RESPONSE_CODE_NOT_FOUND,
        message: "User tidak ditemukan",
      }
    }
    return await sequelize
      .query(
        `
    SELECT s.study_program_id AS jurusan, 
    c.number AS no_ijazah, c.name AS nama_file_ijazah, CAST(c.file AS CHAR CHARSET utf8) AS file_ijazah, c.transcripts_filename AS nama_file_transkrip_nilai, CAST(c.transcripts_file AS CHAR CHARSET utf8) AS file_transkrip_nilai,
    uf.ktp_number AS no_ktp, uf.ktp_filename AS nama_file_ktp, CAST(uf.ktp_file AS CHAR CHARSET utf8) AS file_ktp, uf.cv_filename AS nama_file_cv, CAST(uf.cv_file AS CHAR CHARSET utf8) AS file_cv,
    uf.foreign_language_certificate_filename AS nama_file_sertifikat_bahasa, CAST(uf.foreign_language_certificate_file AS CHAR CHARSET utf8) AS file_sertifikat_bahasa,
    uf.other_first_filename AS nama_file_loa, CAST(uf.other_first_file AS CHAR CHARSET utf8) AS file_loa,
    uf.other_second_filename AS nama_file_surat_rekomendasi, CAST(uf.other_second_file AS CHAR CHARSET utf8) AS file_surat_rekomendasi,
    uf.other_third_filename AS nama_file_surat_usulan, CAST(uf.other_third_file AS CHAR CHARSET utf8) AS file_surat_usulan,
    up.photo_filename AS nama_file_pas_foto, CAST(up.photo AS CHAR CHARSET utf8) AS file_pas_foto,
    CAST(s.doctor_research_proposal AS CHAR CHARSET utf8) AS proposal_doktoral,
    GREATEST( 
      COALESCE(uf.updated_date, uf.created_date, s.created_date),
      COALESCE(c.updated_date, c.created_date, s.created_date),
      COALESCE(s.updated_date, s.created_date)
    ) AS last_updated
    FROM users u 
    JOIN student s ON s.user_id = u.id AND s.is_delete IS FALSE 
    LEFT JOIN user_files uf ON uf.user_id = u.id AND uf.is_delete IS FALSE
    LEFT JOIN certificate c ON c.student_id = s.id AND c.is_delete IS FALSE
    LEFT JOIN user_photo up ON up.user_id = u.id AND up.is_delete IS FALSE
    WHERE u.username = :username AND u.is_active IS TRUE AND u.is_delete IS FALSE
    LIMIT 1;
    `,
        { type: QueryTypes.SELECT, replacements: { username }, plain: true }
      )
      .then((data) => {
        if (!data) {
          throw {
            status: RESPONSE_CODE_NOT_FOUND,
            message: "User tidak ditemukan",
          }
        }

        return {
          jurusan: data.jurusan,
          no_ijazah: data.no_ijazah || "",
          no_ktp: data.no_ktp || "",
          nama_file_ijazah: data.nama_file_ijazah || "",
          file_ijazah: data.file_ijazah,
          nama_file_ktp: data.nama_file_ktp || "",
          file_ktp: data.file_ktp,
          nama_file_cv: data.nama_file_cv || "",
          file_cv: data.file_cv,
          nama_file_pas_foto: data.nama_file_pas_foto || "",
          file_pas_foto: data.file_pas_foto,
          nama_file_transkrip_nilai: data.nama_file_transkrip_nilai || "",
          file_transkrip_nilai: data.file_transkrip_nilai,
          nama_file_sertifikat_bahasa: data.nama_file_sertifikat_bahasa || "",
          file_sertifikat_bahasa: data.file_sertifikat_bahasa,
          nama_file_loa: data.nama_file_loa || "",
          file_loa: data.file_loa,
          nama_file_surat_rekomendasi: data.nama_file_surat_rekomendasi || "",
          file_surat_rekomendasi: data.file_surat_rekomendasi,
          nama_file_surat_usulan: data.nama_file_surat_usulan || "",
          file_surat_usulan: data.file_surat_usulan,
          proposal_doktoral: data.proposal_doktoral || "",
          last_updated: data.last_updated,
        }
      })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updatePendaftaranData = async (value, username) => {
  let transaction = null
  try {
    const userId = await Users.findOne({ where: { username, isActive: true, isDelete: false }, attributes: ["id"], raw: true }).then((data) => {
      if (!data?.id) {
        throw {
          status: RESPONSE_CODE_NOT_FOUND,
          message: "User tidak ditemukan",
        }
      }
      return data.id
    })

    let updatedData = {
      no_ijazah: false,
      file_ijazah: false,
      no_ktp: false,
      file_ktp: false,
      file_cv: false,
      file_pas_foto: false,
      file_transkrip_nilai: false,
      file_sertifikat_bahasa: false,
      file_loa: false,
      file_surat_rekomendasi: false,
      file_surat_usulan: false,
    }

    const studentId = await Student.findOne({ where: { userId, isDelete: false }, attributes: ["id", "studyProgramId", "doctorResearchProposal"], raw: true }).then((data) => {
      if (!data?.id) {
        throw {
          status: RESPONSE_CODE_NOT_FOUND,
          message: "Mahasiswa tidak ditemukan",
        }
      }
      return data.id
    })

    const certificate = await Certificate.findOne({ where: { studentId, isDelete: false }, attributes: ["id", "number", "name", "transriptsFilename"] }).then((data) => {
      if ((data && data.number != value.no_ijazah) || !data) {
        updatedData.no_ijazah = true
      }
      if ((data && data.name != value.nama_file_ijazah) || !data) {
        updatedData.file_ijazah = true
      }
      if ((data && data.transriptsFilename != value.nama_file_transkrip_nilai) || !data) {
        updatedData.file_transkrip_nilai = true
      }
      return data
    })

    const userFiles = await UserFiles.findOne({
      where: { userId, isDelete: false },
      attributes: ["id", "ktpNumber", "ktpFilename", "cvFilename", "foreignLanguageCertificateFilename", "otherFirstFilename", "otherSecondFilename", "otherThirdFilename"],
    }).then((data) => {
      if ((data && data.ktpNumber != value.no_ktp) || !data) {
        updatedData.no_ktp = true
      }
      if ((data && data.ktpFilename != value.nama_file_ktp) || !data) {
        updatedData.file_ktp = true
      }
      if ((data && data.cvFilename != value.nama_file_cv) || !data) {
        updatedData.file_cv = true
      }
      if ((data && data.foreignLanguageCertificateFilename != value.nama_file_sertifikat_bahasa) || !data) {
        updatedData.file_sertifikat_bahasa = true
      }
      if ((data && data.otherFirstFilename != value.nama_file_loa) || !data) {
        updatedData.file_loa = true
      }
      if ((data && data.otherSecondFilename != value.nama_file_surat_rekomendasi) || !data) {
        updatedData.file_surat_rekomendasi = true
      }
      if ((data && data.otherThirdFilename != value.nama_file_surat_usulan) || !data) {
        updatedData.file_surat_usulan = true
      }
      return data
    })

    const userPhoto = await UserPhoto.findOne({ where: { userId, isDelete: false }, attributes: ["id", "photoFilename"] }).then((data) => {
      if ((data && data.photoFilename != value.nama_file_pas_foto) || !data) {
        updatedData.file_pas_foto = true
      }
      return data
    })

    transaction = await sequelize.transaction()

    await Student.update(
      { studyProgramId: value.jurusan, doctorResearchProposal: value.proposal_doktoral || null, facultyId: sequelize.literal(`(SELECT faculty_id FROM study_program WHERE id = ${value.jurusan})`) },
      { where: { userId }, transaction }
    )

    if (updatedData.no_ijazah || updatedData.file_ijazah || updatedData.file_transkrip_nilai) {
      let updatedDataCertificate = {
        updatedDate: new Date(),
        updatedBy: userId,
      }
      if (updatedData.no_ijazah) {
        updatedDataCertificate.number = value.no_ijazah
      }
      if (updatedData.file_ijazah) {
        updatedDataCertificate.name = value.nama_file_ijazah
        updatedDataCertificate.file = value.file_ijazah
      }
      if (updatedData.file_transkrip_nilai) {
        updatedDataCertificate.transriptsFilename = value.nama_file_transkrip_nilai
        updatedDataCertificate.transriptsFile = value.file_transkrip_nilai
      }
      if (certificate) {
        await certificate.update(updatedDataCertificate, { transaction })
      } else {
        await Certificate.create({ ...updatedDataCertificate, studentId, isDelete: false, createdDate: new Date(), createdBy: userId }, { transaction })
      }
    }

    if (
      updatedData.no_ktp ||
      updatedData.file_ktp ||
      updatedData.file_cv ||
      updatedData.file_sertifikat_bahasa ||
      updatedData.file_loa ||
      updatedData.file_surat_rekomendasi ||
      updatedData.file_surat_usulan
    ) {
      let updatedDataFiles = {
        updatedDate: new Date(),
        updatedBy: userId,
      }
      if (updatedData.no_ktp) {
        updatedDataFiles.ktpNumber = value.no_ktp
      }
      if (updatedData.file_ktp) {
        updatedDataFiles.ktpFilename = value.nama_file_ktp
        updatedDataFiles.ktpFile = value.file_ktp
      }
      if (updatedData.file_cv) {
        updatedDataFiles.cvFilename = value.nama_file_cv
        updatedDataFiles.cvFile = value.file_cv
      }
      if (updatedData.file_sertifikat_bahasa) {
        updatedDataFiles.foreignLanguageCertificateFilename = value.nama_file_sertifikat_bahasa
        updatedDataFiles.foreignLanguageCertificateFile = value.file_sertifikat_bahasa
      }
      if (updatedData.file_loa) {
        updatedDataFiles.otherFirstFilename = value.nama_file_loa
        updatedDataFiles.otherFirstFile = value.file_loa
      }
      if (updatedData.file_surat_rekomendasi) {
        updatedDataFiles.otherSecondFilename = value.nama_file_surat_rekomendasi
        updatedDataFiles.otherSecondFile = value.file_surat_rekomendasi
      }
      if (updatedData.file_surat_usulan) {
        updatedDataFiles.otherThirdFilename = value.nama_file_surat_usulan
        updatedDataFiles.otherThirdFile = value.file_surat_usulan
      }

      if (userFiles) {
        await userFiles.update(updatedDataFiles, { transaction })
      } else {
        await UserFiles.create({ ...updatedDataFiles, userId, isDelete: false, createdDate: new Date(), createdBy: userId }, { transaction })
      }
    }

    if (updatedData.file_pas_foto) {
      let updatedDataPhoto = {
        updatedDate: new Date(),
        updatedBy: userId,
        photo: value.file_pas_foto,
        photoFilename: value.nama_file_pas_foto,
      }

      if (userPhoto) {
        await userPhoto.update(updatedDataPhoto, { transaction })
      } else {
        await UserPhoto.create({ ...updatedDataPhoto, userId, isDelete: false, createdDate: new Date(), createdBy: userId }, { transaction })
      }
    }

    await transaction.commit()

    return {
      status: RESPONSE_CODE_SUCCESS,
      message: RESPONSE_MESSAGE_SUCCESS,
    }
  } catch (error) {
    console.error(error)
    if (transaction) {
      await transaction.rollback()
    }
    throw error
  }
}

export const pengajuanPendaftaran = async (username) => {
  let transaction = null
  try {
    const studentId = await Student.findOne({
      where: { isDelete: false },
      attributes: ["id"],
      include: [{ model: Users, where: { username, isActive: true, isDelete: false }, attributes: [], required: true }],
      raw: true,
    }).then((data) => {
      if (!data?.id) {
        throw {
          status: RESPONSE_CODE_NOT_FOUND,
          message: "User tidak ditemukan",
        }
      }
      return data.id
    })

    const statusPendaftaran = await getStatusPendaftaran(username)
    if ([STATUS_PENDAFTARAN_MENGAJUKAN_BERKAS, STATUS_PENDAFTARAN_DIAJUKAN_KEMBALI_BERKAS].includes(statusPendaftaran)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Berkas pendaftaran masih dalam tahap verifikasi",
      }
    }
    if ([STATUS_PENDAFTARAN_DISETUJUI_BERKAS, STATUS_PENDAFTARAN_DIJADWALKAN_WAWANCARA, STATUS_PENDAFTARAN_HADIR_WAWANCARA, STATUS_PENDAFTARAN_TIDAK_HADIR_WAWANCARA].includes(statusPendaftaran)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Tidak dapat mengajukan pendaftaran karna masih dalam proses lanjutan",
      }
    }
    if ([STATUS_PENDAFTARAN_TIDAK_LULUS_PENDAFTARAN].includes(statusPendaftaran)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Pendaftaran ditolak, karena tidak lulus",
      }
    }
    if ([STATUS_PENDAFTARAN_MAHASISWA_AKTIF].includes(statusPendaftaran)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Pendaftaran ditolak, karena sudah menjadi mahasiswa",
      }
    }

    let profileData = await getProfileData(username)
    delete profileData.last_updated
    const profileIsntComplete = schemaValidation(userProfileSchema, profileData).error

    if (profileIsntComplete) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Harap lengkapi terlebih dahulu data profile anda",
      }
    }

    let berkasData = await getPendaftaranData(username)
    const proposalDoktoral = berkasData.proposal_doktoral
    delete berkasData.last_updated
    delete berkasData.nama_file_transkrip_nilai
    delete berkasData.file_transkrip_nilai
    delete berkasData.nama_file_sertifikat_bahasa
    delete berkasData.file_sertifikat_bahasa
    delete berkasData.nama_file_loa
    delete berkasData.file_loa
    delete berkasData.nama_file_surat_rekomendasi
    delete berkasData.file_surat_rekomendasi
    delete berkasData.nama_file_surat_usulan
    delete berkasData.file_surat_usulan
    delete berkasData.proposal_doktoral

    if (Object.values(berkasData).some((v) => !v)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Harap lengkapi terlebih dahulu data berkas pendaftaran anda",
      }
    }

    const jurusan = await sequelize
      .query(`SELECT CASE WHEN LOWER(a.name) LIKE '%s2%' THEN TRUE ELSE FALSE END AS is_magister, a.name FROM study_program a WHERE a.id = :id;`, {
        type: QueryTypes.SELECT,
        replacements: { id: berkasData.jurusan },
        plain: true,
      })
      .then((data) => ({ isMagister: data.is_magister === 1, name: data.name }))

    const umur = hitungUmur(profileData.tanggal_lahir)

    if ((jurusan.isMagister && umur > 35) || (!jurusan.isMagister && umur > 40)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: `Umur anda melebihi persyaratan umum untuk mendaftar ${jurusan.name}`,
      }
    }
    if (!jurusan.isMagister && !proposalDoktoral) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: `Proposal program Doktoral wajib dilengkapi`,
      }
    }

    transaction = await sequelize.transaction()

    await Student.update(
      {
        registrationStatus: statusPendaftaran === STATUS_PENDAFTARAN_BARU ? ENUMERATION_REGISTRATION_STATUS_MENGAJUKAN_BERKAS : ENUMERATION_REGISTRATION_STATUS_DIAJUKAN_KEMBALI_BERKAS,
        updatedDate: new Date(),
        updatedBy: 1,
      },
      { where: { id: studentId }, transaction }
    )

    await transaction.commit()

    return {
      status: RESPONSE_CODE_SUCCESS,
      message: RESPONSE_MESSAGE_SUCCESS,
    }
  } catch (error) {
    console.error(error)
    if (transaction) {
      await transaction.rollback()
    }
    throw error
  }
}

export const ubahPassword = async ({ username, password_lama, password_baru }) => {
  try {
    const user = await Users.findOne({ where: { username, isActive: true, isDelete: false }, attributes: ["id", "username", "password"] })
    if (!user) {
      throw {
        status: RESPONSE_CODE_NOT_FOUND,
        message: "User tidak ditemukan",
      }
    }

    // check password lama
    if (password_lama !== decryptCrypto(user.password)) {
      throw {
        status: RESPONSE_CODE_BAD_REQUEST,
        message: "Password Lama yang anda masukan tidak sesuai",
      }
    }

    await user.update({
      password: encryptCrypto(password_baru),
      updatedDate: new Date(),
      updatedBy: user.id,
    })

    return {
      status: RESPONSE_CODE_SUCCESS,
      message: RESPONSE_MESSAGE_SUCCESS,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
