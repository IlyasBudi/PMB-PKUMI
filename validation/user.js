import { validateEmail, validateNumberLengthAndPrecision } from "@/lib/utils"
import { ID } from "./message_lib_id"

const Joi = require("joi").extend(require("@joi/date"))

export const userProfileSchema = Joi.object()
  .keys({
    nama_lengkap: Joi.string().trim().min(3).max(100).required().label("Nama Lengkap"),
    tempat_lahir: Joi.string().trim().min(3).max(150).required().label("Tempat Lahir"),
    tanggal_lahir: Joi.date().required().label("Tanggal Lahir"),
    jenis_kelamin: Joi.string().required().label("Jenis Kelamin").messages({ "string.empty": "wajib memilih jenis kelamin" }),
    pendidikan_akhir: Joi.number()
      .positive()
      .custom((value, helper) => validateNumberLengthAndPrecision(value, helper, 1, 3))
      .required()
      .label("Pendidikan Terakhir")
      .messages({ "number.base": "wajib memilih pendidikan terakhir" }),
    jurusan_pendidikan_akhir: Joi.string().trim().min(2).max(150).required().label("Jurusan Pendidikan Akhir"),
    universitas_asal: Joi.string().trim().min(2).max(250).required().label("Universitas Asal"),
    username: Joi.string().required().label("Username"),
    nama_ayah: Joi.string().trim().min(3).max(45).optional().allow(null, "").label("Nama Ayah"),
    nama_ibu: Joi.string().trim().min(3).max(45).optional().allow(null, "").label("Nama Ibu"),
    pekerjaan_ayah: Joi.string().trim().min(3).max(100).optional().allow(null, "").label("Pekerjaan Ayah"),
    pekerjaan_ibu: Joi.string().trim().min(3).max(100).optional().allow(null, "").label("Pekerjaan Ibu"),
    alamat_orang_tua: Joi.string().trim().min(3).optional().allow(null, "").label("Alamat Orang Tua"),
    email: Joi.string()
      .custom((value, helper) => (validateEmail(value) ? value : helper.message(`harus berupa email yang valid`)))
      .required()
      .label("Email"),
    no_telp: Joi.number()
      .custom((value, helper) => validateNumberLengthAndPrecision(value, helper, 8, 12))
      .required()
      .label("Nomor Telepon"),
    no_telp_keluarga: Joi.number()
      .allow(null, "")
      .custom((value, helper) => validateNumberLengthAndPrecision(value, helper, 8, 12))
      .optional()
      .label("Nomor Telepon Keluarga"),
  })
  .messages(ID)

const basePendaftaranSchema = {
  no_ijazah: Joi.string().trim().replace(/\s/g, "").min(10).max(50).required().label("Nomor Ijazah"),
  no_ktp: Joi.string().trim().replace(/\s/g, "").length(16).required().label("Nomor KTP"),
  nama_file_ijazah: Joi.string().max(255).required().label("File Ijazah"),
  nama_file_ktp: Joi.string().max(255).required().label("File KTP"),
  nama_file_cv: Joi.string().max(255).required().label("File CV"),
  nama_file_pas_foto: Joi.string().max(255).required().label("Pas Foto"),
  nama_file_transkrip_nilai: Joi.string().max(255).required().label("File Transkrip Nilai"),
  nama_file_sertifikat_bahasa: Joi.string().max(255).optional().allow("").label("File Sertifikat Bahasa Asing"),
  nama_file_loa: Joi.string().max(255).optional().allow("").label("File LOA"),
  nama_file_surat_rekomendasi: Joi.string().max(255).optional().allow("").label("File Surat Rekomendasi"),
  nama_file_surat_usulan: Joi.string().max(255).optional().allow("").label("File Surat Usulan"),
  jurusan: Joi.number()
    .custom((value, helper) => validateNumberLengthAndPrecision(value, helper, 1, 3))
    .required()
    .label("Jurusan")
    .messages({ "number.base": "wajib memilih jurusan" }),
}

export const userPendaftaranSchema = Joi.object().keys(basePendaftaranSchema).messages(ID)

export const userPendaftaranSchemaBE = Joi.object()
  .keys({
    ...basePendaftaranSchema,
    file_ktp: Joi.string().required().label("File KTP"),
    file_ijazah: Joi.string().required().label("File Ijazah"),
    file_cv: Joi.string().required().label("File CV"),
  })
  .messages(ID)

export const userUbahPasswordSchema = Joi.object()
  .keys({
    password_lama: Joi.string().min(6).max(50).required().label("Password Lama"),
    password_baru: Joi.string().min(6).max(50).not(Joi.ref("password_lama")).required().label("Password Baru").messages({ "any.invalid": "{{#label}} harus berbeda dengan Password Lama" }),
    password_konfirmasi: Joi.string().min(6).max(50).valid(Joi.ref("password_baru")).required().label("Password Konfirmasi").messages({ "any.only": "{{#label}} harus sama dengan Password Baru" }),
  })
  .messages(ID)
