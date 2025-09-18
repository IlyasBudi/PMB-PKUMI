"use client"
/* React/Nextjs/Modules */
import { useContext, useState } from "react"
import { useFormik } from "formik"

/* Utils */
import { formatRelativeTime, schemaValidation } from "@/lib/utils"
import { AppContext, UserContext } from "@/context"
import { userProfileSchema } from "@/validation/user"
import { formProfileSchema } from "@/lib/forms/user"
import { errorHandlerServer } from "@/lib/api"
import { actionUpdateProfile } from "./actions"

/* Components */
import Forms from "@/components/forms"
import ErrorMessage from "@/components/forms/ErrorMessage"
import Label from "@/components/forms/Label"
import { Button } from "@/components/ui/Button"

export default function FormProfile({ profile, updatedDate, educationList = [] }) {
  const { userData } = useContext(UserContext)
  const { handleToast } = useContext(AppContext)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(updatedDate)
  const jenisKelaminList = [
    {
      label: "Laki-Laki",
      value: "Laki-laki",
    },
    {
      label: "Perempuan",
      value: "Perempuan",
    },
  ]

  const formik = useFormik({
    initialValues: profile,
    validate: (values) => schemaValidation(userProfileSchema, values).error || {},
    onSubmit: (values) => {
      setIsLoadingSubmit(true)
      actionUpdateProfile(values, userData.username)
        .then(([res, isError]) => {
          if (isError) throw res
          setIsUpdate(false)
          setLastUpdated(new Date())
          return handleToast("success", "Update Profil Success", res.message, 3000)
        })
        .catch((error) => {
          const { message } = errorHandlerServer(error)
          return handleToast("warn", "Update Profil Gagal", message, 3000)
        })
        .finally(() => {
          setIsLoadingSubmit(false)
        })
    },
  })

  const dropdownOptionsMap = {
    pendidikan_akhir: educationList,
    jenis_kelamin: jenisKelaminList,
  }

  const handleCancelUpdate = () => {
    formik.resetForm()
    setIsUpdate(false)
  }

  return (
    <>
      <div className="mt-2 flex justify-end gap-3 lg:mt-0">
        {isUpdate ? (
          <>
            <Button
              label="Simpan"
              disabled={isLoadingSubmit || JSON.stringify(formik.initialValues) === JSON.stringify(formik.values)}
              loading={isLoadingSubmit}
              onClick={() => {
                formik.submitForm()
              }}
              className="w-full lg:w-fit"
            />
            <Button severity="secondary" className="w-full lg:w-fit" label="Cancel" disabled={isLoadingSubmit} onClick={handleCancelUpdate} />
          </>
        ) : (
          <Button label="Ubah Data" onClick={() => setIsUpdate(true)} />
        )}
      </div>
      <form onSubmit={formik.handleSubmit} className="mt-2 grid grid-cols-2 gap-6">
        <div className="col-span-2 flex  flex-col gap-y-4 lg:col-span-1">
          {Object.keys(formik.initialValues).map((key, index, self) => {
            if (index < Math.ceil(self.length / 2)) {
              return (
                <div key={index} className="flex flex-col gap-2">
                  <Label htmlFor={key} required={formProfileSchema[key].props.required}>
                    {formProfileSchema[key].label}
                  </Label>
                  <Forms
                    formtype={formProfileSchema[key].type}
                    id={key}
                    name={key}
                    value={formik.values[key]}
                    onChange={formik.handleChange}
                    disabled={!isUpdate || isLoadingSubmit}
                    className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
                    options={formProfileSchema[key].type === "dropdown" ? dropdownOptionsMap[key] : undefined}
                    {...formProfileSchema[key].props}
                  />
                  <ErrorMessage formtype={formProfileSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
                </div>
              )
            }
          })}
          {lastUpdated && <small className="mt-2 hidden lg:inline-block">terakhir diupdate : {formatRelativeTime(lastUpdated)}</small>}
        </div>
        <div className="col-span-2 flex flex-col gap-y-4 lg:col-span-1">
          {Object.keys(formik.initialValues).map((key, index, self) => {
            if (index >= Math.ceil(self.length / 2)) {
              return (
                <div key={index} className="flex flex-col gap-2">
                  <Label htmlFor={key} required={formProfileSchema[key].props.required}>
                    {formProfileSchema[key].label}
                  </Label>
                  <Forms
                    formtype={formProfileSchema[key].type}
                    id={key}
                    name={key}
                    value={formik.values[key]}
                    onChange={formik.handleChange}
                    disabled={isLoadingSubmit || !isUpdate}
                    className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
                    options={formProfileSchema[key].type === "dropdown" ? dropdownOptionsMap[key] : undefined}
                    {...formProfileSchema[key].props}
                  />
                  {formProfileSchema[key].note && <small className="-mt-1 ml-0.5 text-[0.75rem] text-gray-700">{formProfileSchema[key].note}</small>}
                  <ErrorMessage formtype={formProfileSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
                </div>
              )
            }
          })}
        </div>
        {lastUpdated && <small className="mt-2 lg:hidden">terakhir diupdate : {formatRelativeTime(lastUpdated)}</small>}
      </form>
    </>
  )
}
