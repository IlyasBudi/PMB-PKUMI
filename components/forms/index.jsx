/* React/Nextjs/Modules */
import { AppContext } from "@/context"
import { useContext, useRef, useState } from "react"

/* Utils */
import { cn, convertFileToBase64, getClassNameViewBase64 } from "@/lib/utils"

/* Components */
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Checkbox } from "primereact/checkbox"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "../ui/Button"
import { Dialog } from "primereact/dialog"
import { Chips } from "primereact/chips"
import { ColorPicker } from "primereact/colorpicker"
import { MultiSelect } from "primereact/multiselect"

const InputFile = ({ className, id, name, value, disabled, max = 250, accept, allowedType, ...props }) => {
  const fileInputRef = useRef()
  const { handleToast } = useContext(AppContext)
  const [visibleFileDialog, setVisibleFileDialog] = useState(false)
  return (
    <div className="flex gap-2">
      <div className="p-inputgroup flex">
        <InputText
          id={id}
          name={name}
          value={value}
          readOnly
          disabled={disabled}
          placeholder={props.placeholder || ""}
          onClick={() => fileInputRef.current.click()}
          className={cn("p-inputtext-sm w-full cursor-default placeholder:text-sm placeholder:font-light", className)}
        />
        <Button label="Browse" disabled={disabled} onClick={() => fileInputRef.current.click()} size="small" type="button" />
      </div>
      <Dialog header={value} draggable={false} visible={visibleFileDialog} className="h-screen" style={{ width: "70vw" }} onHide={() => setVisibleFileDialog(false)} breakpoints={{ "1024px": "95vw" }}>
        <embed className={getClassNameViewBase64(props.file)} src={props.file} />
      </Dialog>
      <Button label="Lihat" type="button" className="w-[20%]" onClick={() => setVisibleFileDialog(true)} disabled={!props.file} />
      <InputText
        type="file"
        onChange={async (e) => {
          if (e.target.files[0]) {
            const maxSize = max * 1024 // 250 KB (dalam byte)

            if (e.target.files[0].size > maxSize) {
              return handleToast("warn", "Upload Failed", `file yang diupload melebihi ${max}kb`)
            } else if (!allowedType.includes(e.target.files[0].type)) {
              return handleToast("warn", "Upload Failed", `tipe file yang diupload tidak sesuai`)
            } else {
              props.onChange(name, e.target.files[0].name)
              const base64 = await convertFileToBase64(e.target.files[0])
              return props.setfile(base64)
            }
          }
        }}
        ref={fileInputRef}
        accept={accept}
        className="hidden"
      />
    </div>
  )
}

export default function Forms({ formtype, className, id, name, ref, maxDate, minDate, ...props }) {
  if (formtype === "input_text") {
    return <InputText {...props} id={id} name={name} ref={ref} className={cn("p-inputtext-sm placeholder:text-sm placeholder:font-light", className)} />
  }

  if (formtype === "input_password") {
    return <Password {...props} toggleMask size="small" inputId={id} inputRef={ref} name={name} inputClassName={cn("placeholder:text-sm placeholder:font-light w-full p-inputtext-sm", className)} />
  }

  if (formtype === "checkbox") {
    return <Checkbox {...props} inputId={id} name={name} inputRef={ref}></Checkbox>
  }

  if (formtype === "input_date") {
    return (
      <Calendar
        {...props}
        inputId={id}
        name={name}
        inputRef={ref}
        maxDate={maxDate}
        minDate={minDate}
        inputClassName={cn("placeholder:text-sm placeholder:font-light w-full p-inputtext-sm", className)}
      />
    )
  }

  if (formtype === "dropdown") {
    return <Dropdown {...props} inputId={id} name={name} inputRef={ref} className={cn("p-inputtext-sm w-full placeholder:text-sm placeholder:font-light", className)} />
  }

  if (formtype === "input_file") {
    return <InputFile {...props} id={id} name={name} className={className} />
  }

  if (formtype === "textarea") {
    return <InputTextarea {...props} id={id} name={name} ref={ref} className={cn("p-inputtext-sm placeholder:text-sm placeholder:font-light", className)} rows={5} cols={30} />
  }

  if (formtype === "chips") {
    return <Chips {...props} id={id} name={name} ref={ref} separator="," className={cn("p-inputtext-sm placeholder:text-sm placeholder:font-light", className)} />
  }

  if (formtype === "colorpicker") {
    return <ColorPicker {...props} id={id} name={name} ref={ref} className={cn("p-inputtext-sm placeholder:text-sm placeholder:font-light", className)} />
  }

  if (formtype === "multiselect") {
    return <MultiSelect {...props} id={id} name={name} ref={ref} display="chip" className={cn("p-inputtext-sm placeholder:text-sm placeholder:font-light", className)} />
  }

  return <></>
}
