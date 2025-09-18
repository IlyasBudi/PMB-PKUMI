import * as constants from "@/lib/constants"

export const webPublicMenu = [
  { name: "Beranda", href: constants.CLIENT_PATH.BASE },
  { name: "Download", href: constants.CLIENT_PATH.DOWNLOAD },
  { name: "FAQ", href: constants.CLIENT_PATH.FAQ },
  { name: "Contact", href: constants.CLIENT_PATH.CONTACT },
]

export const webPrivateMenu = {
  admin: [{ name: "Dashboard", href: constants.CLIENT_PATH.DASHBOARD }],
  mahasiswa: [
    { name: "Dashboard", href: constants.CLIENT_PATH.DASHBOARD },
    { name: "Profile", href: constants.CLIENT_PATH.PROFILE },
    { name: "Pendaftaran", href: constants.CLIENT_PATH.FORM_PENDAFTARAN },
    { name: "Bantuan", href: constants.CLIENT_PATH.BANTUAN },
  ],
  dosen: [],
  default: [],
}

export const menuList = {
  admin: [...webPublicMenu.map((v) => v.href), constants.CLIENT_PATH.DASHBOARD],
  mahasiswa: [
    ...webPublicMenu.map((v) => v.href),
    constants.CLIENT_PATH.DASHBOARD,
    constants.CLIENT_PATH.PROFILE,
    constants.CLIENT_PATH.FORM_PENDAFTARAN,
    constants.CLIENT_PATH.UBAH_PASSWORD,
    constants.CLIENT_PATH.BANTUAN,
  ],
  dosen: [constants.CLIENT_PATH.BASE],
}
