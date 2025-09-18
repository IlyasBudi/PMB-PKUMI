/* Utils */
import { cn } from "@/lib/utils"

export default function Label({ children, className, required, ...props }) {
  return (
    <label {...props} className={cn("w-fit text-sm font-medium", className)}>
      {children} {required && <small className="text-red-500">*</small>}
    </label>
  )
}
