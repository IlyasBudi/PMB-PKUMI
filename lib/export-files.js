export const exportPdf = async ({ columns = [], body = [], orientation = "p", header = "", filename = "export-data" }) => {
  // EXAMPLE
  // col = [{ title: table.header, dataKey: table.field }]
  // data = [{ [table.field]: valueData }]

  if (!columns.length || !body.length) return

  return await import("jspdf").then(async (pdf) => {
    await import("jspdf-autotable").then(async () => {
      const doc = new pdf.jsPDF({ orientation })

      doc.setFontSize(12)
      doc.text(header, 14, 10)
      doc.autoTable({ columns, body })
      doc.save(`${filename}.pdf`)
    })
  })
}
