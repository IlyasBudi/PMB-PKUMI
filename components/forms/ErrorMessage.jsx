/* Utils */
import { cn } from "@/lib/utils"

export default function ErrorMessage({ form_type, error = "", isError = false, className, ...props }) {
  if (isError) {
    return (
      <small {...props} className={cn("text-xs text-red-500", className)}>
        {error}
      </small>
    )
  } else {
    return <></>
  }
}
