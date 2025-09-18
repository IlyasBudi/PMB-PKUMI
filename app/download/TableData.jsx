"use client"
/* React/Nextjs/Modules */
import { saveAs } from "file-saver"
import { useEffect, useState } from "react"
import { ENUMERATION_PMB_DOWNLOAD } from "@/lib/constants"
import { getContentPMB } from "@/services/webContent"

/* Components */
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "@/components/ui/Button"
import { dataURItoBlob, getBase64MimeType } from "@/lib/utils"

export const TableData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const downloadTemplate = (value) => {
    const blob = dataURItoBlob(value.detail)
    const fileExt = getBase64MimeType(value.detail)

    return (
      <Button
        label="Download"
        onClick={() => {
          saveAs(blob, `${value.title}.${fileExt ? fileExt.split("/")[1] : ""}`)
        }}
      />
    )
  }

  const getData = () => {
    setLoading(true)
    getContentPMB(ENUMERATION_PMB_DOWNLOAD)
      .then((res) => {
        setData((res || []).map((v, i) => ({ ...v, no: i + 1 })))
      })
      .catch(() => [])
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()

    return () => {}
  }, [])

  return (
    <DataTable value={data} loading={loading} showGridlines responsiveLayout="stack" breakpoint="620px">
      <Column field="no" header="No" className="w-[3%] text-center" />
      <Column field="title" header="Nama File" />
      <Column header="Download" body={downloadTemplate} className="w-[5%]" />
    </DataTable>
  )
}
