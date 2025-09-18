/* eslint-disable react-hooks/exhaustive-deps */
"use client"
/* React/Nextjs/Modules */
import { useContext, useState, useEffect } from "react"
import { useFormik } from "formik"
import { useRouter, useSearchParams } from "next/navigation"

/* Utils */
import httpCall from "@/lib/axios"
import * as constants from "@/lib/constants"
import { AppContext } from "@/context"
import { cn, schemaValidation } from "@/lib/utils"
import { formVerifikasiEmailSchema } from "@/lib/forms/auth"
import { verifikasiEmailSchema } from "@/validation/auth"

/* Components */
import Forms from "@/components/forms"
import ErrorMessage from "@/components/forms/ErrorMessage"
import { Button } from "@/components/ui/Button"

export default function FormVerifikasiEmail() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const { handleToast } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const emailParam = searchParams.get("email")
  const codeParam = searchParams.get("code")

  const formik = useFormik({
    initialValues: {
      email: emailParam || "",
      code: codeParam || "",
    },
    validate: (values) => {
      const validate = schemaValidation(verifikasiEmailSchema, values)
      if (validate.error) {
        return validate.error
      }
      return {}
    },
    onSubmit: (values) => {
      setLoading(true)
      httpCall("POST", constants.API_PATH.AUTH_VERIFIKASI_EMAIL, values)
        .then(() => {
          handleToast("success", "Verifikasi Berhasil", "Silahkan melakukan login", 3000)
          return push(constants.CLIENT_PATH.LOGIN)
        })
        .catch((error) => {
          return handleToast("warn", "Verifikasi Gagal", error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  useEffect(() => {
    if (formik.values.email && formik.values.code) {
      formik.submitForm()
    }
  }, [])

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-4">
      {Object.keys(formik.initialValues).map((key, index) => (
        <div key={index} className={cn("flex gap-2", key === "is_remember" ? "flex-row-reverse items-center justify-end" : "flex-col")}>
          <Forms
            formtype={formVerifikasiEmailSchema[key].type}
            id={key}
            name={key}
            placeholder={formVerifikasiEmailSchema[key].placeholder}
            value={formik.values[key]}
            checked={formik.values[key]}
            onChange={formik.handleChange}
            disabled={loading || searchParams.get(key)}
            className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
          />
          <ErrorMessage formtype={formVerifikasiEmailSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
        </div>
      ))}
      <Button loading={loading} label="Verifikasi Email" type="submit" />
    </form>
  )
}
