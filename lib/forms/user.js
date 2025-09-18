export const formProfileSchema = {
  nama_lengkap: {
    type: "input_text",
    label: "Nama Lengkap",
    props: {
      placeholder: "cth: Zikri Mansyursyah",
      required: true,
    },
  },
  tempat_lahir: {
    type: "input_text",
    label: "Tempat Lahir",
    props: {
      placeholder: "cth: Jakarta Barat",
      required: true,
    },
  },
  tanggal_lahir: {
    type: "input_date",
    label: "Tanggal Lahir",
    props: {
      dateFormat: "yy-mm-dd",
      placeholder: "cth: 1992-01-21",
      showIcon: true,
      required: true,
    },
  },
  jenis_kelamin: {
    type: "dropdown",
    label: "Jenis Kelamin",
    props: {
      placeholder: "pilih jenis kelamin anda",
      optionLabel: "label",
      optionValue: "value",
      required: true,
    },
  },
  pendidikan_akhir: {
    type: "dropdown",
    label: "Pendidikan Terakhir",
    props: {
      placeholder: "pilih pendidikan terakhir anda",
      optionLabel: "label",
      optionValue: "value",
      required: true,
    },
  },
  jurusan_pendidikan_akhir: {
    type: "input_text",
    label: "Jurusan Pendidikan Akhir",
    props: {
      placeholder: "cth: Sastra Inggris",
      required: true,
    },
  },
  universitas_asal: {
    type: "input_text",
    label: "Asal Universitas",
    props: {
      placeholder: "cth: Universitas Indonesia",
      required: true,
    },
  },
  no_telp: {
    type: "input_text",
    label: "Nomor Telepon",
    props: {
      placeholder: "cth: 0812345678901",
      keyfilter: "int",
      required: true,
    },
  },
  no_telp_keluarga: {
    type: "input_text",
    label: "Nomor Telepon Keluarga",
    props: {
      placeholder: "cth: 0812345678901",
      keyfilter: "int",
    },
  },
  nama_ayah: {
    type: "input_text",
    label: "Nama Ayah",
    props: {
      placeholder: "nama ayah kandung",
    },
  },
  nama_ibu: {
    type: "input_text",
    label: "Nama Ibu",
    props: {
      placeholder: "nama ibu kandung",
    },
  },
  pekerjaan_ayah: {
    type: "input_text",
    label: "Pekerjaan Ayah",
    props: {
      placeholder: "pekerjaan ayah",
    },
  },
  pekerjaan_ibu: {
    type: "input_text",
    label: "Pekerjaan Ibu",
    props: {
      placeholder: "pekerjaan ibu",
    },
  },
  alamat_orang_tua: {
    type: "input_text",
    label: "Alamat Orang Tua",
    props: {
      placeholder: "cth: Jl. Cendana ..",
    },
  },
  username: {
    type: "input_text",
    label: "Username",
    props: {
      placeholder: "username",
      required: true,
      disabled: true,
    },
  },
  email: {
    type: "input_text",
    label: "Email",
    props: {
      placeholder: "mail@example.com",
      type: "email",
      required: true,
    },
  },
  no_ijazah: {
    type: "input_text",
    label: "Nomor Ijazah",
    props: {
      placeholder: "02/TIxxxxxx",
      required: true,
    },
  },
  nama_file_ijazah: {
    type: "input_file",
    label: "File Ijazah",
    props: {
      placeholder: "pilih file ijazah anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  no_ktp: {
    type: "input_text",
    label: "Nomor KTP",
    props: {
      placeholder: "360312xxxxxxxxxx",
      required: true,
    },
  },
  nama_file_ktp: {
    type: "input_file",
    label: "File KTP",
    props: {
      placeholder: "pilih file KTP anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_cv: {
    type: "input_file",
    label: "File Curriculum Vitae",
    props: {
      placeholder: "pilih file CV anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
}

export const formPendaftaranSchema = {
  jurusan: {
    type: "dropdown",
    label: "Jurusan",
    props: {
      placeholder: "pilih jurusan yang dituju",
      optionLabel: "label",
      optionValue: "value",
      required: true,
    },
  },
  no_ijazah: {
    type: "input_text",
    label: "Nomor Ijazah",
    props: {
      placeholder: "02/TIxxxxxx",
      required: true,
    },
  },
  nama_file_pas_foto: {
    type: "input_file",
    label: "Pas Foto",
    props: {
      placeholder: "pilih file pas foto anda",
      max: 512,
      allowedType: ["image/png", "image/jpg", "image/jpeg"],
      accept: "image/*",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, dan maksimal 512kb",
  },
  nama_file_ijazah: {
    type: "input_file",
    label: "File Ijazah",
    props: {
      placeholder: "pilih file ijazah anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  no_ktp: {
    type: "input_text",
    label: "Nomor KTP",
    props: {
      placeholder: "360312xxxxxxxxxx",
      required: true,
    },
  },
  nama_file_ktp: {
    type: "input_file",
    label: "File KTP",
    props: {
      placeholder: "pilih file KTP anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_cv: {
    type: "input_file",
    label: "File Curriculum Vitae",
    props: {
      placeholder: "pilih file CV anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_transkrip_nilai: {
    type: "input_file",
    label: "File Transkrip Nilai",
    props: {
      placeholder: "pilih file transkrip nilai anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
      required: true,
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_sertifikat_bahasa: {
    type: "input_file",
    label: "File Sertifikat Bahasa Asing (jika ada)",
    props: {
      placeholder: "pilih file sertifikat bahasa asing anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_loa: {
    type: "input_file",
    label: "File LOA (jika ada)",
    props: {
      placeholder: "pilih file LOA anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_surat_rekomendasi: {
    type: "input_file",
    label: "File Surat Rekomendasi (jika ada)",
    props: {
      placeholder: "pilih file surat rekomendasi anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
  nama_file_surat_usulan: {
    type: "input_file",
    label: "File Surat Usulan (jika ada)",
    props: {
      placeholder: "pilih file surat usulan anda",
      max: 250,
      allowedType: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
      accept: "image/*, .pdf",
    },
    note: "file bertipe .jpg, .jpeg, .png, .pdf dan maksimal 250kb",
  },
}

export const formUbahPasswordSchema = {
  password_lama: {
    type: "input_password",
    label: "Password Lama",
    props: {
      placeholder: "password lama",
      required: true,
    },
  },
  password_baru: {
    type: "input_password",
    label: "Password Baru",
    props: {
      placeholder: "password baru",
      required: true,
    },
  },
  password_konfirmasi: {
    type: "input_password",
    label: "Password Konfirmasi",
    props: {
      placeholder: "password konfirmasi",
      required: true,
    },
  },
}
