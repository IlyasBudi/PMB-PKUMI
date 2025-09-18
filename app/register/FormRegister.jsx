"use client"
/* React/Nextjs/Modules */
import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"

/* Utils */
import { formRegisterSchema } from "@/lib/forms/auth"
import { schemaValidation } from "@/lib/utils"
import { registerSchema } from "@/validation/auth"
import httpCall from "@/lib/axios"
import * as constants from "@/lib/constants"
import { AppContext } from "@/context"

/* Components */
import Forms from "@/components/forms"
import ErrorMessage from "@/components/forms/ErrorMessage"
import { Button } from "@/components/ui/Button"
import Label from "@/components/forms/Label"

export default function FormRegister() {
  const router = useRouter()
  const { handleToast } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: (values) => {
      const validate = schemaValidation(registerSchema, values)
      if (validate.error) {
        return validate.error
      }
      return {}
    },
    onSubmit: (values) => {
      setLoading(true)
      httpCall("POST", constants.API_PATH.AUTH_REGISTER, values)
        .then(() => {
          handleToast("success", "Register Berhasil", "Silahkan periksa email anda untuk melakukan verifikasi", 3000)

          return router.push(constants.CLIENT_PATH.LOGIN)
        })
        .catch((error) => {
          return handleToast("warn", "Register Gagal", error.message, 5000)
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-4">
      {Object.keys(formik.initialValues).map((key, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Label htmlFor={key}>{formRegisterSchema[key].label}</Label>
          <Forms
            formtype={formRegisterSchema[key].type}
            id={key}
            name={key}
            placeholder={formRegisterSchema[key].placeholder}
            value={formik.values[key]}
            checked={formik.values[key]}
            onChange={formik.handleChange}
            disabled={loading}
            className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
          />
          <ErrorMessage formtype={formRegisterSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
        </div>
      ))}
      <Button loading={loading} label="Register" type="submit" className="mt-1" />
    </form>
  )
}
