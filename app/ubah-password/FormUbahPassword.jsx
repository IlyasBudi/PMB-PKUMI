"use client"
/* React/Next/Modules */
import { useState } from "react"
import { useAppContext, useUserContext } from "@/context"
import { useFormik } from "formik"

/* Utils */
import { schemaValidation } from "@/lib/utils"
import { userUbahPasswordSchema } from "@/validation/user"
import { actionUbahPassword } from "./actions"
import { errorHandlerServer } from "@/lib/api"
import { formUbahPasswordSchema } from "@/lib/forms/user"

/* Components */
import Label from "@/components/forms/Label"
import Forms from "@/components/forms"
import ErrorMessage from "@/components/forms/ErrorMessage"
import { Button } from "@/components/ui/Button"

export default function FormUbahPassword() {
  const { userData } = useUserContext()
  const { handleToast } = useAppContext()

  /* Form States */
  const [formIsLoading, setFormIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      password_lama: "",
      password_baru: "",
      password_konfirmasi: "",
    },
    validate: (values) => schemaValidation(userUbahPasswordSchema, values).error || {},
    onSubmit: (values) => {
      if (!userData?.username) return
      setFormIsLoading(true)
      actionUbahPassword({ ...values, username: userData.username })
        .then((res) => {
          if (res.isError) throw res
          formik.resetForm()
          return handleToast("success", res.message, "Ubah Password Success", 3000)
        })
        .catch((error) => {
          const { message } = errorHandlerServer(error)
          return handleToast("warn", "Ubah Password Gagal", message, 3000)
        })
        .finally(() => setFormIsLoading(false))
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="mt-4 grid grid-cols-12 gap-4">
      {Object.keys(formik.initialValues).map((key, index) => (
        <div key={index} className="col-span-12 flex flex-col gap-1 md:col-span-6 lg:col-span-4">
          <Label htmlFor={key} required={formUbahPasswordSchema[key].props.required}>
            {formUbahPasswordSchema[key].label}
          </Label>
          <Forms
            formtype={formUbahPasswordSchema[key].type}
            id={key}
            name={key}
            value={formik.values[key]}
            onChange={formik.handleChange}
            disabled={formIsLoading}
            className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
            {...formUbahPasswordSchema[key].props}
          />
          <ErrorMessage formtype={formUbahPasswordSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
        </div>
      ))}
      <Button
        disabled={formIsLoading}
        label="Ubah"
        type="submit"
        className="col-span-12 h-fit w-fit place-self-end md:col-span-6 md:mt-6 md:place-self-auto lg:col-span-12 lg:mt-0 lg:place-self-end"
      />
    </form>
  )
}
