export const formLoginSchema = {
  username: {
    type: "input_text",
    label: "Username",
    placeholder: "masukan username / email anda",
  },
  password: {
    type: "input_password",
    label: "Password",
    placeholder: "masukan password anda",
  },
  is_remember: {
    type: "checkbox",
    label: "Ingat saya",
    placeholder: "",
  },
}

export const formRegisterSchema = {
  username: {
    type: "input_text",
    label: "Username",
    placeholder: "masukan username anda",
  },
  email: {
    type: "input_text",
    label: "Email",
    placeholder: "masukan email anda",
  },
  password: {
    type: "input_password",
    label: "Password",
    placeholder: "masukan password anda",
  },
}

export const formVerifikasiEmailSchema = {
  email: {
    type: "input_text",
    label: "Email",
    placeholder: "masukan email anda",
  },
  code: {
    type: "input_text",
    label: "Kode Verifikasi",
    placeholder: "masukan kode verifikasi",
  },
}
