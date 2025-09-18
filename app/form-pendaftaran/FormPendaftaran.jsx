"use client"
/* React/Nextjs/Modules */
import { useContext, useState } from "react"
import { useFormik } from "formik"

/* Utils */
import { formatRelativeTime, schemaValidation } from "@/lib/utils"
import { AppContext, UserContext } from "@/context"
import { userPendaftaranSchema } from "@/validation/user"
import { formPendaftaranSchema } from "@/lib/forms/user"
import { actionPengajuanPendaftaran, actionUpdatePendaftaran } from "./actions"
import { errorHandlerServer } from "@/lib/api"
import * as constants from "@/lib/constants"
import { getStatusPendaftaran } from "@/services/user"

/* Components */
import { Button } from "@/components/ui/Button"
import Forms from "@/components/forms"
import ErrorMessage from "@/components/forms/ErrorMessage"
import Label from "@/components/forms/Label"
import { Editor } from "primereact/editor"
import { Dialog } from "primereact/dialog"

export default function FormPendaftaran({ jurusanList = [], status = null, data }) {
  const { userData } = useContext(UserContext)
  const { handleToast } = useContext(AppContext)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingSubmitAjuPendaftaran, setIsLoadingSubmitAjuPendaftaran] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date(data.last_updated))
  const [regisState, setRegisState] = useState(status)
  const [initialDoctorProposal, setInitialDoctorProposal] = useState(data.proposal_doktoral)
  const [doctorProposal, setDoctorProposal] = useState(data.proposal_doktoral)
  const [visibleDialog, setVisibleDialog] = useState(false)
  const [visibleDialogPersetujuan, setVisibleDialogPersetujuan] = useState(false)

  /* Files */
  const [fileIjazah, setFileIjazah] = useState(data.file_ijazah)
  const [fileKTP, setFileKTP] = useState(data.file_ktp)
  const [fileCV, setFileCV] = useState(data.file_cv)
  const [filePasFoto, setFilePasFoto] = useState(data.file_pas_foto)
  const [fileTranskripNilai, setFileTranskripNilai] = useState(data.file_transkrip_nilai)
  const [fileSertifikatBahasa, setFileSertifikatBahasa] = useState(data.file_sertifikat_bahasa)
  const [fileLOA, setFileLOA] = useState(data.file_loa)
  const [fileSuratRekomendasi, setFileSuratRekomendasi] = useState(data.file_surat_rekomendasi)
  const [fileSuratUsulan, setFileSuratUsulan] = useState(data.file_surat_usulan)

  const handleAjuPendaftaran = () => {
    setIsLoadingSubmitAjuPendaftaran(true)
    actionPengajuanPendaftaran(userData.username)
      .then(async ([res, isError]) => {
        if (isError) throw res
        setLastUpdated(new Date())
        await getStatusPendaftaran(userData.username)
          .then((data) => {
            if (data) {
              setRegisState(data.status)
            }
          })
          .catch((err) => {
            console.log({ err })
          })
        return handleToast("success", "Pengajuan Pendaftaran Success", res.message, 3000)
      })
      .catch((error) => {
        const { message } = errorHandlerServer(error)
        return handleToast("warn", "Pengajuan Pendaftaran Gagal", message, 3000)
      })
      .finally(() => {
        setIsLoadingSubmitAjuPendaftaran(false)
      })
  }

  const mapButtonState = {
    [constants.STATUS_PENDAFTARAN_BARU]: {
      visible: true,
      label: "Ajukan Pendaftaran",
      disabled: false,
      severity: "success",
      onClick: () => setVisibleDialogPersetujuan(true),
    },
    [constants.STATUS_PENDAFTARAN_MENGAJUKAN_BERKAS]: {
      visible: true,
      label: "Sedang Mengajukan Pendaftaran",
      disabled: true,
      severity: "info",
      onClick: () => {
        return handleToast("warn", "Gagal Mengajukan Pendaftaran", "Sedang Mengajukan Pendaftaran", 3000)
      },
    },
    [constants.STATUS_PENDAFTARAN_DISETUJUI_BERKAS]: {
      visible: false,
    },
    [constants.STATUS_PENDAFTARAN_DITOLAK_BERKAS]: {
      visible: true,
      label: "Ajukan Kembali Pendaftaran",
      disabled: false,
      severity: "success",
      onClick: () => setVisibleDialogPersetujuan(true),
    },
    [constants.STATUS_PENDAFTARAN_DIAJUKAN_KEMBALI_BERKAS]: {
      visible: true,
      label: "Sedang Mengajukan Pendaftaran",
      disabled: true,
      severity: "info",
      onClick: () => {
        return handleToast("warn", "Gagal Mengajukan Pendaftaran", "Sedang Mengajukan Pendaftaran", 3000)
      },
    },
    [constants.STATUS_PENDAFTARAN_DIJADWALKAN_WAWANCARA]: {
      visible: false,
    },
    [constants.STATUS_PENDAFTARAN_HADIR_WAWANCARA]: {
      visible: false,
    },
    [constants.STATUS_PENDAFTARAN_TIDAK_HADIR_WAWANCARA]: {
      visible: false,
    },
    [constants.STATUS_PENDAFTARAN_TIDAK_LULUS_PENDAFTARAN]: {
      visible: false,
    },
    [constants.STATUS_PENDAFTARAN_MAHASISWA_AKTIF]: {
      visible: false,
    },
    [null]: {
      visible: false,
    },
    ERROR: {
      visible: true,
      label: "Diperlukan Refresh",
      disabled: true,
      severity: "danger",
      onClick: () => {
        return window.location.reload()
      },
    },
  }

  const formik = useFormik({
    initialValues: {
      jurusan: data.jurusan,
      no_ijazah: data.no_ijazah,
      no_ktp: data.no_ktp,
      nama_file_pas_foto: data.nama_file_pas_foto,
      nama_file_ijazah: data.nama_file_ijazah,
      nama_file_transkrip_nilai: data.nama_file_transkrip_nilai,
      nama_file_ktp: data.nama_file_ktp,
      nama_file_cv: data.nama_file_cv,
      nama_file_sertifikat_bahasa: data.nama_file_sertifikat_bahasa,
      nama_file_loa: data.nama_file_loa,
      nama_file_surat_rekomendasi: data.nama_file_surat_rekomendasi,
      nama_file_surat_usulan: data.nama_file_surat_usulan,
    },
    validate: (values) => {
      console.log({ values })
      const validate = schemaValidation(userPendaftaranSchema, values)
      if (validate.error) {
        return validate.error
      }
      return {}
    },
    onSubmit: (values) => {
      const jurusan = jurusanList.find((v) => v.value === values.jurusan)?.label
      if (jurusan && jurusan.includes("S3") && !doctorProposal) {
        return handleToast("warn", "Update Form Pendaftaran Gagal", "Harap lengkapi Proposal Program Doktoral", 3000)
      }
      setIsLoadingSubmit(true)
      actionUpdatePendaftaran(
        {
          ...values,
          file_ijazah: fileIjazah,
          file_cv: fileCV,
          file_ktp: fileKTP,
          file_pas_foto: filePasFoto,
          file_transkrip_nilai: fileTranskripNilai,
          file_sertifikat_bahasa: fileSertifikatBahasa,
          file_loa: fileLOA,
          file_surat_rekomendasi: fileSuratRekomendasi,
          file_surat_usulan: fileSuratUsulan,
          proposal_doktoral: doctorProposal,
        },
        userData.username
      )
        .then(([res, isError]) => {
          if (isError) throw res
          setIsUpdate(false)
          setLastUpdated(new Date())
          return handleToast("success", res.message, "Update Form Pendaftaran Success", 3000)
        })
        .catch((error) => {
          const { message } = errorHandlerServer(error)
          return handleToast("warn", "Update Form Pendaftaran Gagal", message, 3000)
        })
        .finally(() => {
          setIsLoadingSubmit(false)
        })
    },
  })

  const dropdownOptionsMap = {
    jurusan: jurusanList,
  }

  const setFileMap = {
    nama_file_ijazah: setFileIjazah,
    nama_file_ktp: setFileKTP,
    nama_file_cv: setFileCV,
    nama_file_pas_foto: setFilePasFoto,
    nama_file_transkrip_nilai: setFileTranskripNilai,
    nama_file_sertifikat_bahasa: setFileSertifikatBahasa,
    nama_file_loa: setFileLOA,
    nama_file_surat_rekomendasi: setFileSuratRekomendasi,
    nama_file_surat_usulan: setFileSuratUsulan,
  }

  const fileMap = {
    nama_file_ijazah: fileIjazah,
    nama_file_ktp: fileKTP,
    nama_file_cv: fileCV,
    nama_file_pas_foto: filePasFoto,
    nama_file_transkrip_nilai: fileTranskripNilai,
    nama_file_sertifikat_bahasa: fileSertifikatBahasa,
    nama_file_loa: fileLOA,
    nama_file_surat_rekomendasi: fileSuratRekomendasi,
    nama_file_surat_usulan: fileSuratUsulan,
  }

  const handleCancelUpdate = () => {
    formik.resetForm()
    setIsUpdate(false)
  }

  const onHideDialog = () => {
    setVisibleDialog(false)
    setDoctorProposal(initialDoctorProposal)
  }

  const onHideDialogPersetujuan = () => {
    setVisibleDialogPersetujuan(false)
  }

  const onShowDialog = () => {
    setDoctorProposal(initialDoctorProposal)
    setVisibleDialog(true)
  }

  const templateFooterProposal = (
    <div className="mt-2 flex gap-x-2">
      <Button label="Batal" severity="secondary" className="w-full" />
      <Button
        label="Simpan"
        className="w-full"
        onClick={() => {
          setVisibleDialog(false)
          setInitialDoctorProposal(doctorProposal)
        }}
        disabled={JSON.stringify(initialDoctorProposal) === JSON.stringify(doctorProposal)}
      />
    </div>
  )
  const templateFooterPersetujuan = (
    <div className="mt-2 flex gap-x-2">
      <Button label="Batal" severity="secondary" className="w-full" />
      <Button
        label="Setuju"
        className="w-full"
        onClick={() => {
          setVisibleDialogPersetujuan(false)
          handleAjuPendaftaran()
        }}
      />
    </div>
  )

  return (
    <>
      <div className="mt-2 flex justify-end gap-3 lg:mt-0">
        {mapButtonState[regisState].visible && (
          <Button
            label={mapButtonState[regisState].label}
            disabled={mapButtonState[regisState].disabled || isLoadingSubmitAjuPendaftaran}
            loading={isLoadingSubmitAjuPendaftaran}
            severity={mapButtonState[regisState].severity}
            onClick={mapButtonState[regisState].onClick}
            className="w-full lg:w-fit"
          />
        )}
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
          <Button label="Ubah Data" className="w-full lg:w-fit" onClick={() => setIsUpdate(true)} />
        )}
      </div>
      <form onSubmit={formik.handleSubmit} className="mt-2 grid grid-cols-2 gap-6">
        <div className="col-span-2 flex  flex-col gap-y-4 lg:col-span-1">
          {Object.keys(formik.initialValues).map((key, index, self) => {
            if (index < Math.ceil(self.length / 2)) {
              return (
                <div key={index} className="flex flex-col gap-2">
                  <Label htmlFor={key} required={formPendaftaranSchema[key].props.required}>
                    {formPendaftaranSchema[key].label}
                  </Label>
                  <Forms
                    formtype={formPendaftaranSchema[key].type}
                    id={key}
                    name={key}
                    value={formik.values[key]}
                    onChange={formPendaftaranSchema[key].type === "input_file" ? formik.setFieldValue : formik.handleChange}
                    disabled={!isUpdate || isLoadingSubmit}
                    className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
                    options={formPendaftaranSchema[key].type === "dropdown" ? dropdownOptionsMap[key] : undefined}
                    setfile={formPendaftaranSchema[key].type === "input_file" ? setFileMap[key] : undefined}
                    file={formPendaftaranSchema[key].type === "input_file" ? fileMap[key] : undefined}
                    {...formPendaftaranSchema[key].props}
                  />
                  <ErrorMessage formtype={formPendaftaranSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
                </div>
              )
            }
          })}
          <small className="mt-2 hidden lg:inline-block">terakhir diupdate : {formatRelativeTime(lastUpdated)}</small>
        </div>
        <div className="col-span-2 flex flex-col gap-y-4 lg:col-span-1">
          {Object.keys(formik.initialValues).map((key, index, self) => {
            if (index >= Math.ceil(self.length / 2)) {
              return (
                <div key={index} className="flex flex-col gap-2">
                  <Label htmlFor={key} required={formPendaftaranSchema[key].props.required}>
                    {formPendaftaranSchema[key].label}
                  </Label>
                  <Forms
                    formtype={formPendaftaranSchema[key].type}
                    id={key}
                    name={key}
                    value={formik.values[key]}
                    onChange={formPendaftaranSchema[key].type === "input_file" ? formik.setFieldValue : formik.handleChange}
                    disabled={isLoadingSubmit || !isUpdate}
                    className={formik.touched[key] && formik.errors[key] ? "border border-red-400" : ""}
                    setfile={formPendaftaranSchema[key].type === "input_file" ? setFileMap[key] : undefined}
                    file={formPendaftaranSchema[key].type === "input_file" ? fileMap[key] : undefined}
                    {...formPendaftaranSchema[key].props}
                  />
                  {formPendaftaranSchema[key].note && <small className="-mt-1 ml-0.5 text-[0.75rem] text-gray-700">{formPendaftaranSchema[key].note}</small>}
                  <ErrorMessage formtype={formPendaftaranSchema[key].type} isError={formik.touched[key] && formik.errors[key]} error={formik.errors[key]} />
                </div>
              )
            }
          })}
          {(jurusanList.find((v) => formik.values.jurusan && v.value === formik.values.jurusan)?.label || "").includes("S3") && (
            <Button label="Proposal Program Doktoral" type="button" onClick={onShowDialog} />
          )}
        </div>
        <small className="mt-2 inline-block lg:hidden">terakhir diupdate : {formatRelativeTime(lastUpdated)}</small>
      </form>
      <Dialog
        header="Proposal Program Doktoral"
        draggable={false}
        visible={visibleDialog}
        footer={templateFooterProposal}
        className="h-screen"
        onHide={onHideDialog}
        breakpoints={{ "1024px": "95vw" }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="proposal">Proposal Program Doktor</Label>
          <Editor
            value={doctorProposal}
            onTextChange={(e) => setDoctorProposal(e.htmlValue)}
            style={{ height: "320px" }}
            id="proposal"
            name="proposal"
            readOnly={isLoadingSubmit || !isUpdate}
            disabled={isLoadingSubmit || !isUpdate}
          />
        </div>
      </Dialog>
      <Dialog
        header="Pernyataan Persetujuan Pendaftaran"
        draggable={false}
        visible={visibleDialogPersetujuan}
        footer={templateFooterPersetujuan}
        onHide={onHideDialogPersetujuan}
        breakpoints={{ "1024px": "95vw" }}
      >
        <div>
          dengan menekan tombol <b>Setuju</b> maka anda telah menyetujui persetujuan dibawah ini
        </div>
        <small className="block">- dengan ini saya dengan sadar menyetujui semua peraturan yang berlaku tentang pendaftaran di PKUMI</small>
        <small className="block">- pernyataan komitmen kembali ke indonesia dan rencara kontribusi di indonesia pasca studi</small>
      </Dialog>
    </>
  )
}
